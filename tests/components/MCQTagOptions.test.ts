import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import MCQTagOptions from "@components/MCQ/MCQTagOptions.vue";
import { getUniquePropertyValues } from "@components/QuestionStore";
import { createPinia, setActivePinia } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("MCQTagOptions.vue", () => {
  it("Renders filter options", () => {
    const wrapper = mount(MCQTagOptions, {
      props: {
        filterSet: {
          course: ["VETS2011", "VETS2012"],
          subject: ["Physiology", "Anatomy"],
          system: ["Neurophysiology", "Cardiovascular"],
          animal: ["Horse"],
        },
      },
    });

    expect(wrapper.findAll(".category").length).toBe(4);
  });

  it("Returns an empty array when input is empty", () => {
    const tags = [];

    const uniqueCourses = getUniquePropertyValues(tags);
    expect(uniqueCourses).toEqual({});
  });

  it("returns unique values for a given property", () => {
    const tags = [
      {
        course: "VETS2011",
        subject: "Physiology",
        system: "Neurophysiology",
        animal: "Horse",
      },
      {
        course: "VETS2011",
        subject: "Anatomy",
        system: "Cardiovascular",
        animal: "Horse",
      },
      {
        course: "VETS2012",
        subject: "Physiology",
        system: "Neurophysiology",
        animal: "Horse",
      },
    ];

    const uniqueCourses = getUniquePropertyValues(tags);
    expect(uniqueCourses).toEqual({
      course: ["VETS2011", "VETS2012"],
      subject: ["Physiology", "Anatomy"],
      system: ["Neurophysiology", "Cardiovascular"],
      animal: ["Horse"],
    });
  });
});
