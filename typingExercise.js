(function () {
  const DEFAULT_TARGET_TEXT =
    "La práctica constante mejora la precisión, la velocidad y la confianza al escribir.";

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function describeCharacter(character) {
    if (character === " ") {
      return "espacio";
    }
    if (character === "\n") {
      return "salto de línea";
    }
    return character || "vacío";
  }

  function createInitialState(targetText) {
    return {
      targetText,
      typedText: "",
      errorLog: [],
      lastProcessedLength: 0,
      startedAt: null,
      completedAt: null,
    };
  }

  function validateCopy(targetText, typedText) {
    const characters = Array.from(targetText).map((expected, index) => {
      if (index >= typedText.length) {
        return { expected, actual: "", index, status: "pending" };
      }

      const actual = typedText[index];
      return {
        expected,
        actual,
        index,
        status: actual === expected ? "correct" : "incorrect",
      };
    });

    const correctCount = characters.filter((character) => character.status === "correct").length;
    const currentIncorrectCount = characters.filter((character) => character.status === "incorrect").length;
    const pendingCount = characters.filter((character) => character.status === "pending").length;
    const extraCount = Math.max(typedText.length - targetText.length, 0);

    return {
      characters,
      correctCount,
      currentIncorrectCount,
      pendingCount,
      extraCount,
      isComplete: typedText.length >= targetText.length && pendingCount === 0 && currentIncorrectCount === 0 && extraCount === 0,
    };
  }

  function createErrorEntry(targetText, typedText, index, startedAt, occurredAt) {
    const expected = targetText[index] || "";
    const actual = typedText[index] || "";

    return {
      index,
      expected,
      actual,
      occurredAt,
      elapsedMs: startedAt ? occurredAt - startedAt : 0,
    };
  }

  function updateStateWithInput(state, typedText, now = Date.now()) {
    const nextState = { ...state };
    nextState.typedText = typedText;

    if (!nextState.startedAt && typedText.length > 0) {
      nextState.startedAt = now;
    }

    for (let index = 0; index < typedText.length; index += 1) {
      const typedCharacterChanged = typedText[index] !== state.typedText[index];
      const typedCharacterIsIncorrect = typedText[index] !== state.targetText[index];

      if (typedCharacterChanged && typedCharacterIsIncorrect) {
        nextState.errorLog = [
          ...nextState.errorLog,
          createErrorEntry(state.targetText, typedText, index, nextState.startedAt, now),
        ];
      }
    }

    const validation = validateCopy(state.targetText, typedText);
    nextState.completedAt = validation.isComplete && !nextState.completedAt ? now : nextState.completedAt;
    nextState.lastProcessedLength = typedText.length;

    return { state: nextState, validation };
  }

  function calculateFinalAccuracy(correctCount, registeredErrorCount) {
    const totalEvaluated = correctCount + registeredErrorCount;
    if (totalEvaluated === 0) {
      return 100;
    }
    return Math.max(0, Math.round((correctCount / totalEvaluated) * 100));
  }

  function renderCharacters(targetElement, characters) {
    targetElement.innerHTML = characters
      .map(
        (character) =>
          `<span class="char ${character.status}" data-index="${character.index}">${escapeHtml(character.expected)}</span>`,
      )
      .join("");
  }

  function renderErrorLog(errorLogElement, errorLog) {
    if (errorLog.length === 0) {
      errorLogElement.innerHTML = "<li>Aún no hay errores registrados.</li>";
      return;
    }

    errorLogElement.innerHTML = errorLog
      .map((error) => {
        const elapsedSeconds = (error.elapsedMs / 1000).toFixed(1);
        return `<li>Posición ${error.index + 1}: se esperaba <strong>${escapeHtml(
          describeCharacter(error.expected),
        )}</strong> y se escribió <strong>${escapeHtml(describeCharacter(error.actual))}</strong> (${elapsedSeconds}s).</li>`;
      })
      .join("");
  }

  function createErrorSound() {
    let audioContext;

    return function playErrorSound({ enabled, volume }) {
      if (!enabled) {
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }

      audioContext = audioContext || new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "square";
      oscillator.frequency.value = 220;
      gain.gain.value = Number(volume);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.09);
    };
  }

  function initialiseTypingExercise(documentRef = document) {
    const elements = {
      targetText: documentRef.getElementById("target-text"),
      copyInput: documentRef.getElementById("copy-input"),
      soundEnabled: documentRef.getElementById("sound-enabled"),
      soundVolume: documentRef.getElementById("sound-volume"),
      resetButton: documentRef.getElementById("reset-button"),
      correctCount: documentRef.getElementById("correct-count"),
      errorCount: documentRef.getElementById("error-count"),
      pendingCount: documentRef.getElementById("pending-count"),
      accuracyRate: documentRef.getElementById("accuracy-rate"),
      completionMessage: documentRef.getElementById("completion-message"),
      errorLog: documentRef.getElementById("error-log"),
    };

    const playErrorSound = createErrorSound();
    let state = createInitialState(DEFAULT_TARGET_TEXT);

    function render(validation = validateCopy(state.targetText, state.typedText)) {
      renderCharacters(elements.targetText, validation.characters);
      elements.correctCount.textContent = String(validation.correctCount);
      elements.errorCount.textContent = String(state.errorLog.length);
      elements.pendingCount.textContent = String(validation.pendingCount);
      elements.accuracyRate.textContent = `${calculateFinalAccuracy(validation.correctCount, state.errorLog.length)}%`;
      elements.completionMessage.textContent = validation.isComplete
        ? `Ejercicio completado con ${state.errorLog.length} error(es) registrado(s).`
        : "Completa el ejercicio para ver el resultado final.";
      renderErrorLog(elements.errorLog, state.errorLog);
    }

    elements.copyInput.addEventListener("input", (event) => {
      const previousErrors = state.errorLog.length;
      const result = updateStateWithInput(state, event.target.value);
      state = result.state;

      if (state.errorLog.length > previousErrors) {
        playErrorSound({ enabled: elements.soundEnabled.checked, volume: elements.soundVolume.value });
      }

      render(result.validation);
    });

    elements.resetButton.addEventListener("click", () => {
      state = createInitialState(DEFAULT_TARGET_TEXT);
      elements.copyInput.value = "";
      elements.copyInput.focus();
      render();
    });

    render();

    return {
      getState: () => state,
      setInputValue: (value) => {
        const result = updateStateWithInput(state, value);
        state = result.state;
        elements.copyInput.value = value;
        render(result.validation);
      },
    };
  }

  if (typeof window !== "undefined") {
    window.TypingExercise = {
      calculateFinalAccuracy,
      createInitialState,
      initialiseTypingExercise,
      updateStateWithInput,
      validateCopy,
    };

    window.addEventListener("DOMContentLoaded", () => initialiseTypingExercise());
  }

  if (typeof module !== "undefined") {
    module.exports = {
      calculateFinalAccuracy,
      createInitialState,
      updateStateWithInput,
      validateCopy,
    };
  }
})();
