import { describe, it, expect, beforeEach } from "vitest";
import { questions } from "@data/question-data.json";
import MCQQuiz from "@components/MCQ/MCQQuiz.vue";
import { mount, VueWrapper, DOMWrapper } from "@vue/test-utils";
import { getOptions } from "./MCQQuestion.test";

let wrapper: VueWrapper;
let mcqBtn: Omit<DOMWrapper<Element>, "exists">;

beforeEach(async () => {
  wrapper = mount(MCQQuiz, {
    props: {
      questions,
    },
  });

  await wrapper.vm.$nextTick();
  mcqBtn = wrapper.get(".mcq-button");
});

const questionIsFullyDisplayed = (wrapper: VueWrapper) => {
  const titleExists = wrapper.find(".mcq-title").exists();
  const optionsListExists = wrapper.find(".mcq-list").exists();
  const buttonExists = wrapper.find(".mcq-button").exists();
  return titleExists && optionsListExists && buttonExists;
};

describe("MCQQuiz.vue", () => {
  it("Renders quiz properly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("MCQ Quiz");
    expect(wrapper.text()).toContain("The question 0");
  });

  it("Navigates question stack upon skip", async () => {
    await mcqBtn.trigger("click");
    expect(wrapper.text()).toContain("The question 1");
  });

  it("Navigates question stack upon submission and next", async () => {
    const optionList = getOptions(wrapper);
    const firstOption = optionList[0];
    await firstOption.trigger("click");
    await mcqBtn.trigger("click");
    await mcqBtn.trigger("click");
    expect(wrapper.text()).toContain("The question 1");
  });

  it("Should go back to first question when skipping all the questions", async () => {
   for (let i = 0; i < questions.length; i++) {
      await mcqBtn.trigger("click");      
    }
    expect(wrapper.text()).toContain("The question 0");
  });

  it("Should display all questions properly when skipping them", async () => {
    for (let i = 0; i < questions.length; i++) {
      expect(questionIsFullyDisplayed(wrapper)).toBe(true);
      await mcqBtn.trigger("click");      
     }
  });

  it("Should display all questions properly when answering them", async () => {
    const optionList = getOptions(wrapper);
    const firstOption = optionList[0];
    for (let i = 0; i < questions.length; i++) {
      expect(questionIsFullyDisplayed(wrapper)).toBe(true);
      await firstOption.trigger("click");
      await mcqBtn.trigger("click");
      await mcqBtn.trigger("click");      
    }
  });

  it("Should display no questions after answering them all", async () => {
    const optionList = getOptions(wrapper);
    const firstOption = optionList[0];
    for (let i = 0; i < questions.length; i++) {
      await firstOption.trigger("click");
      await mcqBtn.trigger("click");
      await mcqBtn.trigger("click");      
    }
    expect(questionIsFullyDisplayed(wrapper)).toBe(false);
  });
});
