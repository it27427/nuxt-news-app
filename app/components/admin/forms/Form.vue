<template>
  <BaseForm @submit="handleSubmit" class="animated-form">
    <div v-for="field in fields" :key="field.name" class="mb-4">
      <FormInput
        :id="field.name"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder ?? ''"
        v-model="formData[field.name]!"
        :error="errors[field.name] ?? ''"
        :validated="validatedFields[field.name] ?? false"
        @update:modelValue="() => handleValidate(field.name)"
      />
    </div>

    <BaseButton
      type="submit"
      :label="submitText"
      variant="primary"
      :loading="isLoading"
    />
  </BaseForm>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';
  import BaseButton from '~/components/admin/common/BaseButton.vue';
  import BaseForm from '~/components/admin/common/BaseForm.vue';
  import FormInput from '~/components/admin/forms/FormInput.vue';

  interface Field {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  }

  const props = defineProps<{
    fields: Field[];
    submitText?: string;
    initialData?: Record<string, string>;
  }>();

  const emit = defineEmits<{
    (e: 'submit', data: Record<string, string>): void;
  }>();

  const toast = useToast();
  const submitText = props.submitText ?? 'Submit';
  const isLoading = ref(false);

  // Reactive form data
  const formData = reactive<Record<string, string>>(
    Object.fromEntries(
      props.fields.map((f) => [f.name, props.initialData?.[f.name] ?? ''])
    ) as Record<string, string>
  );

  // Errors & validated fields (use string | null)
  const errors = reactive<Record<string, string | undefined>>(
    Object.fromEntries(props.fields.map((f) => [f.name, undefined]))
  );

  const validatedFields = reactive<Record<string, boolean>>(
    Object.fromEntries(props.fields.map((f) => [f.name, false]))
  );

  // Validate a single field
  function validateField(field: Field, value: string): string | undefined {
    const trimmed = value.trim();
    if (field.required && !trimmed) return `${field.label} is required`;
    if (field.minLength && trimmed.length < field.minLength)
      return `${field.label} must be at least ${field.minLength} characters`;
    if (field.maxLength && trimmed.length > field.maxLength)
      return `${field.label} must be less than ${field.maxLength} characters`;
    return undefined;
  }

  // Handle validation for a single field
  function handleValidate(fieldName: string) {
    const field = props.fields.find((f) => f.name === fieldName);
    if (!field) return;

    const errorMsg = validateField(field, formData[fieldName]!);
    errors[fieldName] = errorMsg;
    validatedFields[fieldName] = !errorMsg;
  }

  // Validate entire form and show first error dynamically
  function validateForm(): boolean {
    let firstError: string | null = null;

    props.fields.forEach((f) => {
      handleValidate(f.name);
      if (!firstError && errors[f.name]) {
        //@ts-ignore
        firstError = errors[f.name];
      }
    });

    if (firstError) toast.error(firstError);
    return !firstError;
  }

  // Form submission
  async function handleSubmit() {
    if (!validateForm()) return;

    isLoading.value = true;
    try {
      emit('submit', { ...formData });
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Form submitted successfully!');
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
</script>

<style scoped lang="scss">
  .animated-form {
    animation: fadeInFromTop 0.8s ease-out;
  }

  @keyframes fadeInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
