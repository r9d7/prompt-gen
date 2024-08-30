import { writeClipboard } from "@solid-primitives/clipboard";
import { For, JSX, Show, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { Transition } from "solid-transition-group";

import { Icon } from "~/components/icon";

const WIZARD_STEP_TRANSITION_DURATION = 300;

type WizardState = {
  currentStep: number;
  steps: {
    prompt: string;
    placeholder?: string;
    value: string;
  }[];
};

const getInitialWizardState: () => WizardState = () => ({
  currentStep: 0,
  steps: [
    {
      prompt: "I want you to act as",
      placeholder: "a motivational coach",
      value: "",
    },
    {
      prompt: "I will",
      placeholder: "provide you with information about my goals and challenges",
      value: "",
    },
    {
      prompt: "and you will",
      placeholder: "come up with strategies that can help achieve my goals",
      value: "",
    },
    {
      prompt: "also, you should",
      placeholder: "provide positive affirmations",
      value: "",
    },
    { prompt: "format the result", placeholder: "as plain text", value: "" },
    { prompt: "follow this example", value: "" },
  ],
});

export default function App() {
  let inputRef: HTMLInputElement | undefined;

  const [wizard, setWizard] = createStore<WizardState>(getInitialWizardState());

  const stepsWithValues = createMemo(() =>
    wizard.steps.filter((step) => Boolean(step.value.length)),
  );

  const handleInput: JSX.ChangeEventHandler<HTMLInputElement, Event> = (e) => {
    setWizard("steps", wizard.currentStep, "value", e.currentTarget.value);
  };

  const handleKeyPress: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    e,
  ) => {
    if (e.key === "Enter") {
      handleNextStep();
    }
  };

  const handlePrevStep = () => {
    setWizard("currentStep", (currentStep) =>
      currentStep > 0 ? currentStep - 1 : currentStep,
    );
  };
  const handleNextStep = () => {
    setWizard("currentStep", (currentStep) =>
      currentStep < wizard.steps.length - 1 ? currentStep + 1 : currentStep,
    );
  };

  const handleReset = () => {
    setWizard(getInitialWizardState());
  };
  const handleCopy = () => {
    writeClipboard(
      stepsWithValues()
        .map((step) => `${step.prompt} ${step.value}`)
        .join(", ")
        .concat("."),
    );
  };

  return (
    <div class="w-screen min-h-screen flex items-center px-4">
      <main class="w-full max-w-screen-md mx-auto space-y-8">
        <div class="space-y-4">
          <Transition
            mode="outin"
            onEnter={(el, done) => {
              const animation = el.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: WIZARD_STEP_TRANSITION_DURATION,
              });

              animation.finished.then(() => {
                done();

                inputRef?.focus();
              });
            }}
            onExit={(el, done) => {
              const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: WIZARD_STEP_TRANSITION_DURATION,
              });

              animation.finished.then(done);
            }}
          >
            <For each={wizard.steps}>
              {(step, i) => (
                <Show when={i() === wizard.currentStep}>
                  <section class="flex flex-col gap-4">
                    <h2 class="text-xl text-muted-foreground [&:first-letter]:uppercase">
                      {step.prompt}
                    </h2>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={step.placeholder}
                      value={step.value}
                      onInput={handleInput}
                      onKeyPress={handleKeyPress}
                      class="text-3xl font-bold bg-transparent border-b border-input py-4"
                    />
                  </section>
                </Show>
              )}
            </For>
          </Transition>

          <div
            class={[
              "flex gap-1",
              "[&>button]-(bg-foreground text-background py-2 px-4 rounded-full)",
              "[&>button:not(:disabled):hover]:bg-opacity-70",
              "[&>button:active]:bg-opacity-100",
              "[&>button:disabled]-(opacity-30 cursor-not-allowed)",
            ].join(" ")}
          >
            <button
              onClick={handlePrevStep}
              disabled={!Boolean(wizard.currentStep)}
            >
              Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={wizard.currentStep === wizard.steps.length - 1}
            >
              {Boolean(wizard.steps[wizard.currentStep].value.length)
                ? "Next"
                : "Skip"}
            </button>
          </div>
        </div>

        <Show when={stepsWithValues().length}>
          <div class="bg-muted rounded-3xl p-4 space-y-1">
            <span class="text-muted-foreground">Prompt:</span>
            <p class="italic [&:first-letter]:uppercase">
              <For each={stepsWithValues()}>
                {(step, i) => (
                  <>
                    {step.prompt} <span class="underline">{step.value}</span>
                    {i() === stepsWithValues().length - 1 ? "." : ", "}
                  </>
                )}
              </For>
            </p>
            <div
              class={[
                "flex gap-1",
                "[&>button]-(flex gap-1 items-center bg-transparent py-1 px-2 rounded-full text-sm)",
                "[&>button:hover]:bg-background",
                "[&>button:active]:bg-opacity-70",
              ].join(" ")}
            >
              <button onClick={handleReset}>
                <Icon.reset />
                Reset
              </button>
              <button onClick={handleCopy}>
                <Icon.copy />
                Copy
              </button>
            </div>
          </div>
        </Show>
      </main>
    </div>
  );
}
