import * as Haptics from "expo-haptics";

/**
 * Thin haptics wrappers. Every call is fire-and-forget and swallows errors so
 * that devices without a taptic engine (or a denied permission) never crash a
 * timer transition.
 */

export function tapLight(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function tapMedium(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function notifySuccess(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function notifyWarning(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
