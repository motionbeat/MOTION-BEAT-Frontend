import { useEffect, useState, useRef } from "react";
import { Parser } from "utils/parser";
import SoundManager from "components/common/soundManager.js";

const useJudgeEvent = () => {
  return (result) => {
    const event = new CustomEvent("scoreUpdate", { detail: { result } });
    window.dispatchEvent(event);
  };
};

const TriggerMyHitEffect = ({ target, elem, closestNote }) => {
  useEffect(() => {
    const hitEffect = document.getElementById(`${target}HitEffect`);
    if (!hitEffect) return;

    if (closestNote) {
      elem.current.removeChild(closestNote);
    }

    hitEffect.classList.add("active");

    const timer = setTimeout(() => {
      hitEffect.classList.remove("active");
    }, 350);

    return () => clearTimeout(timer);
  }, [target, elem, closestNote]);

  return null;
};

const findClosestNote = (instrument) => {
  const notes = document.querySelectorAll(
    `.Note[data-instrument="${instrument}"]`
  );
  let closestNote = null;
  let minIndex = Infinity;

  notes.forEach((note) => {
    const index = parseInt(note.getAttribute("data-index"), 10);
    if (!isNaN(index) && index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  });

  return { closestNote, minIndex };
};

const JudgeComponent = ({ key, time, instrument, myPosition, myRailRef }) => {
  const soundManager = SoundManager();
  const dispatchJudgeEvent = useJudgeEvent();
  const [result, setResult] = useState("ignore");
  const closestNoteRef = useRef(null);
  const minIndexRef = useRef(Infinity);

  useEffect(() => {
    const { closestNote, minIndex } = findClosestNote(instrument);
    closestNoteRef.current = closestNote;
    minIndexRef.current = minIndex;

    if (!closestNoteRef.current) {
      console.log("No valid note elements found.");
      setResult("ignore");
      return;
    }

    const noteTime = parseInt(
      closestNoteRef.current.getAttribute("data-time"),
      10
    );
    const timeDiff = noteTime - time;
    const currentMotion = Parser(key);

    console.log(
      `가장 가까운 노트: ${
        closestNoteRef.current
      }, 인덱스: ${closestNoteRef.current.getAttribute("data-index")} `
    );
    console.log(
      `Test Time... 노트의 시간:${noteTime}, 현재 시간: ${time}, 시간차: ${timeDiff}, 노트의 시간: ${currentMotion} `
    );

    if (timeDiff < -50) {
      console.log("IGNORE");
      closestNoteRef.current.setAttribute(
        "data-index",
        minIndexRef.current + 100
      );
      dispatchJudgeEvent("ignore");
    } else if (
      timeDiff >= -50 &&
      timeDiff <= 500 &&
      closestNoteRef.current.getAttribute("data-motion") === currentMotion
    ) {
      soundManager.playMotionSFX(instrument, currentMotion);

      setResult("hit");
      sessionStorage.setItem("instrument", instrument);
      sessionStorage.setItem("motion", currentMotion);

      dispatchJudgeEvent("hit");
      TriggerMyHitEffect({
        target: `player${myPosition}`,
        elem: myRailRef,
        closestNote: closestNoteRef.current,
      });

      closestNoteRef.current.remove();
    } else {
      setResult("ignore");
    }
  }, [key, time, instrument, myPosition, myRailRef, dispatchJudgeEvent, soundManager]);

  return null;
};

export default JudgeComponent;
