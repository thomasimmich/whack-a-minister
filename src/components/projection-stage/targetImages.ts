import enemyDefaultImage from "../../assets/enemy-default.png";
import enemyHitImage from "../../assets/enemy-hit.png";
import friendDefaultImage from "../../assets/friend-default.png";
import friendHitImage from "../../assets/friend-hit.png";
import timeBonusDefaultImage from "../../assets/time-bonus.png";
import timeBonusHitImage from "../../assets/time-bonus-hit.png";
import type { CSSProperties } from "react";
import type { TargetKind } from "../../stores/sessionStore";

const TIME_BONUS_DEFAULT_WIDTH = 197;
const TIME_BONUS_DEFAULT_HEIGHT = 672;
const TIME_BONUS_DEFAULT_WIDTH_RATIO =
  TIME_BONUS_DEFAULT_WIDTH / TIME_BONUS_DEFAULT_HEIGHT;
const TIME_BONUS_HIT_OFFSET_Y = "16%";

export function getTimeBonusHitWrapperStyle(): CSSProperties {
  return { transform: `translateY(${TIME_BONUS_HIT_OFFSET_Y})` };
}

export function getTargetImageLayout(
  kind: TargetKind,
  isHit?: boolean,
): { className: string; style?: CSSProperties } {
  if (kind === "timeBonus" && isHit) {
    return {
      className: "mx-auto block h-auto object-contain",
      style: { width: `${TIME_BONUS_DEFAULT_WIDTH_RATIO * 100}%` },
    };
  }

  return {
    className: "h-full w-full object-contain",
  };
}

export function getTargetImage(kind: TargetKind, isHit?: boolean) {
  if (kind === "enemy") {
    return isHit ? enemyHitImage : enemyDefaultImage;
  }

  if (kind === "friend") {
    return isHit ? friendHitImage : friendDefaultImage;
  }

  return isHit ? timeBonusHitImage : timeBonusDefaultImage;
}
