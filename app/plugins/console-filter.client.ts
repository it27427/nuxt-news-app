// app/plugins/console-filter.client.ts
// This plugin attempts to suppress all known extension-related console errors and warnings.

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Shared patterns for identifying extension-related content
    const extensionPatterns = [
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'extension://',
      'Grammarly',
      'grm ERROR',
      'net::ERR_FILE_NOT_FOUND',
      'Could not establish connection',
      'Receiving end does not exist',
      'Failed to load resource',
    ];

    const isExtensionError = (args: any[]): boolean => {
      return args.some((a) => {
        // Check if the argument is a string containing any of the patterns
        if (typeof a === 'string') {
          return extensionPatterns.some((p) => a.includes(p));
        }

        // Aggressive Check: Check Error object properties (e.g., error.message, error.name)
        if (a instanceof Error) {
          const errorMsg = `${a.name}: ${a.message}`;
          return extensionPatterns.some((p) => errorMsg.includes(p));
        }

        // Catch all: Check if any object argument contains relevant data (less reliable but aggressive)
        if (typeof a === 'object' && a !== null) {
          try {
            const jsonString = JSON.stringify(a);
            return extensionPatterns.some((p) => jsonString.includes(p));
          } catch (e) {
            // Ignore circular structures, just check standard properties
          }
        }
        return false;
      });
    };

    // 1. Override console.error and console.warn
    const origError = console.error;
    const origWarn = console.warn;

    console.error = (...args: any[]) => {
      if (isExtensionError(args)) {
        return; // Suppress
      }
      origError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      if (isExtensionError(args)) {
        return; // Suppress
      }
      origWarn.apply(console, args);
    };

    // 2. Suppress Uncaught JavaScript Errors: window.onerror
    const origWindowError = window.onerror;
    window.onerror = function (msg, src, line, col, err) {
      if (
        (typeof msg === 'string' &&
          extensionPatterns.some((p) => msg.includes(p))) ||
        (typeof src === 'string' &&
          extensionPatterns.some((p) => src.includes(p)))
      ) {
        return true; // Suppress by returning true
      }
      return origWindowError?.apply(this, [msg, src, line, col, err]) ?? false;
    };

    // 3. Suppress Resource Loading Errors: window.addEventListener('error', ...)
    window.addEventListener(
      'error',
      (event) => {
        const target = event.target as HTMLElement | null;
        let url: string | undefined;

        // Check 1: Target is a <link> or <script> (TypeScript-safe check)
        if (target instanceof HTMLLinkElement) {
          url = target.href;
        } else if (target instanceof HTMLScriptElement) {
          url = target.src;
        }

        // If a matching URL is found, suppress the event
        if (url && extensionPatterns.some((p) => url.includes(p))) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return false;
        }

        // Check 2: Handle generic error events
        if (
          event.message &&
          extensionPatterns.some((p) => event.message.includes(p))
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return false;
        }
      },
      true // Use Capture Phase
    );
  }
});
