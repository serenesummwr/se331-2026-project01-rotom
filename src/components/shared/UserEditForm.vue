<script setup lang="ts">
import { computed, watch } from "vue";
import { useForm } from "vee-validate";
import BaseButton from "./BaseButton.vue";
import { profileSchema } from "@/validation/profileSchemas";
import type { User, UserEditable } from "@/types";

const props = defineProps<{
  user: User;
  provinces: string[];
  saving?: boolean;
}>();

const emit = defineEmits<{
  save: [values: UserEditable];
  cancel: [];
}>();

function pick(user: User): UserEditable {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    province: user.province,
    bio: user.bio,
  };
}

const { errors, defineField, handleSubmit, resetForm, isSubmitting } = useForm<UserEditable>({
  validationSchema: profileSchema,
  initialValues: pick(props.user),
});

const fieldOptions = {
  validateOnModelUpdate: false,
};

const [firstName, firstNameAttrs] = defineField("firstName", fieldOptions);

const [lastName, lastNameAttrs] = defineField("lastName", fieldOptions);

const [email, emailAttrs] = defineField("email", fieldOptions);
const [phone, phoneAttrs] = defineField("phone", fieldOptions);

const [province, provinceAttrs] = defineField("province", fieldOptions);

const [bio, bioAttrs] = defineField("bio", fieldOptions);

const busy = computed(() => Boolean(props.saving) || isSubmitting.value);

watch(
  () => props.user.id,
  () => {
    resetForm({
      values: pick(props.user),
    });
  },
);

const validatedSubmit = handleSubmit((values) => {
  emit("save", {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    province: values.province.trim(),
    bio: values.bio.trim(),
  });
});

function onSubmit(event: Event) {
  if (busy.value) return;

  void validatedSubmit(event);
}

function cancel() {
  if (busy.value) return;

  emit("cancel");
}

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-muted/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
</script>

<template>
  <form class="space-y-5" novalidate :aria-busy="busy" @submit.prevent="onSubmit">
    <fieldset class="grid min-w-0 gap-4 sm:grid-cols-2" :disabled="busy">
      <label class="block">
        <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
          First name
        </span>

        <input
          v-model="firstName"
          v-bind="firstNameAttrs"
          :class="fieldClass"
          :aria-invalid="Boolean(errors.firstName)"
          :aria-describedby="errors.firstName ? 'edit-first-name-error' : undefined"
          autocomplete="given-name"
        />

        <span
          v-if="errors.firstName"
          id="edit-first-name-error"
          class="text-danger mt-1 block text-xs"
        >
          {{ errors.firstName }}
        </span>
      </label>

      <label class="block">
        <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
          Last name
        </span>

        <input
          v-model="lastName"
          v-bind="lastNameAttrs"
          :class="fieldClass"
          :aria-invalid="Boolean(errors.lastName)"
          :aria-describedby="errors.lastName ? 'edit-last-name-error' : undefined"
          autocomplete="family-name"
        />

        <span
          v-if="errors.lastName"
          id="edit-last-name-error"
          class="text-danger mt-1 block text-xs"
        >
          {{ errors.lastName }}
        </span>
      </label>

      <label class="block">
        <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
          Email
        </span>

        <input
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          :class="fieldClass"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="errors.email ? 'edit-email-error' : undefined"
          autocomplete="email"
        />

        <span v-if="errors.email" id="edit-email-error" class="text-danger mt-1 block text-xs">
          {{ errors.email }}
        </span>
      </label>

      <label class="block">
        <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
          Phone
        </span>

        <input
          v-model="phone"
          v-bind="phoneAttrs"
          :class="fieldClass"
          :aria-invalid="Boolean(errors.phone)"
          :aria-describedby="errors.phone ? 'edit-phone-error' : undefined"
          placeholder="08X XXX XXXX"
          autocomplete="tel"
          inputmode="numeric"
        />

        <span v-if="errors.phone" id="edit-phone-error" class="text-danger mt-1 block text-xs">
          {{ errors.phone }}
        </span>
      </label>

      <label class="block sm:col-span-2">
        <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
          Province
        </span>

        <select
          v-model="province"
          v-bind="provinceAttrs"
          :class="fieldClass"
          :aria-invalid="Boolean(errors.province)"
          :aria-describedby="errors.province ? 'edit-province-error' : undefined"
        >
          <option value="" disabled>Select a province</option>

          <option v-if="province && !provinces.includes(province)" :value="province">
            {{ province }}
          </option>

          <option v-for="item in provinces" :key="item" :value="item">
            {{ item }}
          </option>
        </select>

        <span
          v-if="errors.province"
          id="edit-province-error"
          class="text-danger mt-1 block text-xs"
        >
          {{ errors.province }}
        </span>
      </label>

      <label class="block sm:col-span-2">
        <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
          About
        </span>

        <textarea
          v-model="bio"
          v-bind="bioAttrs"
          rows="3"
          :class="fieldClass"
          :aria-invalid="Boolean(errors.bio)"
          :aria-describedby="errors.bio ? 'edit-bio-error' : undefined"
        />

        <span v-if="errors.bio" id="edit-bio-error" class="text-danger mt-1 block text-xs">
          {{ errors.bio }}
        </span>
      </label>
    </fieldset>

    <div class="flex flex-wrap items-center gap-3">
      <BaseButton type="submit" :disabled="busy">
        {{ busy ? "Please wait…" : "Save changes" }}
      </BaseButton>

      <BaseButton type="button" variant="ghost" :disabled="busy" @click="cancel">
        Cancel
      </BaseButton>
    </div>
  </form>
</template>
