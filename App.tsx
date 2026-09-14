import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond/600SemiBold";
import { CormorantGaramond_400Regular_Italic } from "@expo-google-fonts/cormorant-garamond/400Regular_Italic";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import Orb from "./src/Orb";
import { EMOTION_STATES, type Reading } from "./src/data";
import {
  initial,
  stationReducer,
  weekFor,
  visibleReading,
  dayId,
  type Screen,
} from "./src/model";
import { colors as c, fonts as f } from "./src/theme";

function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      aria-disabled={disabled}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondaryButton,
        disabled && s.disabled,
        focused && { borderColor: c.text, borderWidth: 2 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text
        style={[
          s.buttonText,
          secondary && { color: c.text },
          disabled && { color: c.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={s.eyebrow}>{children}</Text>;
}
function Seal({ sealed = true }: { sealed?: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}>
      <Circle
        cx={12}
        cy={12}
        r={10}
        stroke={sealed ? c.gold : c.muted}
        fill="none"
      />
      <Rect
        x={8}
        y={11}
        width={8}
        height={6}
        rx={1.5}
        stroke={c.secondary}
        fill="none"
      />
      <Path
        d={sealed ? "M9 11V9A3 3 0 0115 9V11" : "M9 11V9A3 3 0 0115 9"}
        stroke={c.secondary}
        fill="none"
      />
    </Svg>
  );
}
function Chip({ reading }: { reading: Reading }) {
  const state = EMOTION_STATES.find((e) => e.id === reading.state)!;
  return (
    <View style={[s.chip, { backgroundColor: state.color + "22" }]}>
      <Text style={{ color: state.color, fontFamily: f.medium, fontSize: 13 }}>
        {state.label}
      </Text>
    </View>
  );
}
function ScreenReveal({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  const opacity = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    const a = Animated.timing(opacity, {
      toValue: 1,
      duration: reduced ? 0 : 350,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [opacity, reduced]);
  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}

function StationApp() {
  const [state, dispatch] = useReducer(stationReducer, initial);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(false);
  const [focused, setFocused] = useState(false);
  const [forceFailure, setForceFailure] = useState(false);
  const selector = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { screen, draft, reading } = state;
  const selected = EMOTION_STATES.find((e) => e.id === draft.selectedState);
  const week = weekFor(reading);
  const navigate = (to: Screen) => dispatch({ type: "navigate", screen: to });
  const goBack = () => {
    if (state.sheet) {
      dispatch({ type: "sheet", id: null });
      return;
    }
    if (screen === "forecast-result") navigate("new-reading");
    else navigate("today");
  };

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setReduced(v);
    });
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "today" && !state.sheet) return false;
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [screen, state.sheet]);
  useEffect(() => {
    if (screen !== "generating") return;
    setPhase(false);
    const phaseTimer = setTimeout(() => setPhase(true), 900);
    const timer = setTimeout(() => {
      if (forceFailure) {
        setForceFailure(false);
        dispatch({ type: "navigate", screen: "error" });
      } else dispatch({ type: "complete" });
    }, 1800);
    return () => {
      clearTimeout(timer);
      clearTimeout(phaseTimer);
    };
  }, [screen, forceFailure]);
  const submit = () => {
    if (!draft.selectedState || screen === "generating") return;
    Keyboard.dismiss();
    navigate("generating");
  };
  const topLevel = screen === "today" || screen === "weekly-climate";

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <StatusBar style="light" />
      <View style={s.app}>
        {screen !== "generating" && screen !== "error" && (
          <View style={s.header}>
            {topLevel ? (
              <Text style={s.wordmark}>Emotion Weather Station</Text>
            ) : (
              <Pressable
                onPress={goBack}
                accessibilityRole="button"
                style={s.back}
              >
                <Text style={s.backText}>
                  ‹{" "}
                  {screen === "forecast-result"
                    ? "Back to Reading"
                    : "Back to Today"}
                </Text>
              </Pressable>
            )}
          </View>
        )}
        <ScreenReveal key={screen} reduced={reduced}>
          {screen === "today" && (
            <ScrollView contentContainerStyle={s.content}>
              <Eyebrow>
                {reading ? "TODAY’S READING" : "THE OBSERVATORY · TODAY"}
              </Eyebrow>
              <Text accessibilityRole="header" style={s.title}>
                {reading?.headline ?? "The sky is waiting."}
              </Text>
              {!reading && (
                <Text style={s.body}>
                  Record a fictional emotional temperature and let the
                  instruments shape it into a forecast.
                </Text>
              )}
              <View style={s.orb}>
                <Orb state={reading?.state ?? null} animate reduced={reduced} />
              </View>
              {reading && (
                <Text style={[s.body, { marginBottom: 24 }]}>
                  {reading.interpretation}
                </Text>
              )}
              <Button
                label={reading ? "View Full Forecast" : "Take Today’s Reading"}
                onPress={() =>
                  navigate(reading ? "forecast-result" : "new-reading")
                }
              />
              {reading ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigate("weekly-climate")}
                  style={s.textAction}
                >
                  <Text style={s.link}>Visit Weekly Climate</Text>
                </Pressable>
              ) : (
                <View style={[s.card, { marginTop: 20 }]}>
                  <Eyebrow>LAST OBSERVED · FRIDAY</Eyebrow>
                  <Text style={s.cardTitle}>
                    Charged winds with flashes of invention
                  </Text>
                  <View
                    style={[
                      s.chip,
                      { backgroundColor: "#F0836A22", alignSelf: "flex-start" },
                    ]}
                  >
                    <Text style={{ color: "#F0836A", fontFamily: f.medium }}>
                      Solar Flare
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          {screen === "new-reading" && (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={s.content}
              >
                <Eyebrow>NEW READING · 1 OF 1</Eyebrow>
                <Text style={s.title} accessibilityRole="header">
                  Calibrate the inner sky
                </Text>
                <Text style={s.body}>
                  Choose the atmosphere closest to this fictional moment.
                </Text>
                <ScrollView
                  ref={selector}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.selectionRow}
                  accessibilityLabel="Emotional temperature"
                >
                  {EMOTION_STATES.map((e, i) => {
                    const active = draft.selectedState === e.id;
                    return (
                      <Pressable
                        key={e.id}
                        accessibilityRole="radio"
                        accessibilityLabel={e.ariaLabel}
                        accessibilityState={{ checked: active }}
                        aria-checked={active}
                        onPress={() => {
                          dispatch({
                            type: "draft",
                            patch: { selectedState: e.id },
                          });
                          selector.current?.scrollTo({
                            x: Math.max(0, i * 112 - 100),
                            animated: !reduced,
                          });
                        }}
                        style={[
                          s.option,
                          active && {
                            borderColor: e.color,
                            backgroundColor: c.selected,
                          },
                        ]}
                      >
                        <Orb state={e.id} size={60} />
                        <Text
                          style={[s.optionLabel, active && { color: e.color }]}
                        >
                          {e.label}
                        </Text>
                        <Text style={s.small}>{e.descriptor}</Text>
                        <Text
                          style={{ color: e.color, fontSize: 14, height: 19 }}
                        >
                          {active ? "✓" : ""}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <View style={[s.card, s.row, { marginBottom: 24 }]}>
                  <Orb state={draft.selectedState} size={60} />
                  <View style={{ flex: 1 }}>
                    {selected ? (
                      <>
                        <Text style={[s.label, { color: selected.color }]}>
                          {selected.label}
                        </Text>
                        <Text style={s.small}>{selected.description}</Text>
                      </>
                    ) : (
                      <Text style={s.small}>
                        Select an emotional temperature above
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={[s.label, { marginBottom: 8 }]}>
                  Field note <Text style={s.small}>(optional)</Text>
                </Text>
                <View
                  style={[
                    s.inputBox,
                    (focused || draft.reflection.length === 180) && {
                      borderColor: c.gold,
                    },
                  ]}
                >
                  <TextInput
                    multiline
                    maxLength={180}
                    value={draft.reflection}
                    onChangeText={(reflection) =>
                      dispatch({ type: "draft", patch: { reflection } })
                    }
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="What is moving through this imagined day?"
                    placeholderTextColor={c.muted}
                    selectionColor={c.gold}
                    accessibilityLabel="Field note, optional, maximum 180 characters"
                    style={s.input}
                  />
                  <View style={s.inputFooter}>
                    <Text style={[s.small, { flex: 1 }]}>
                      Keep it fictional and under 180 characters.
                    </Text>
                    <Text
                      style={[
                        s.small,
                        {
                          color:
                            draft.reflection.length === 180 ? c.gold : c.muted,
                        },
                      ]}
                    >
                      {draft.reflection.length} / 180
                    </Text>
                  </View>
                </View>
                <View style={[s.card, s.row, { marginVertical: 24 }]}>
                  <Seal sealed={draft.isSealed} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.label}>Seal this reading</Text>
                    <Text style={s.small}>
                      {draft.isSealed
                        ? "The entire entry will stay hidden until you choose to unseal it."
                        : "Its forecast and field note will appear in Weekly Climate."}
                    </Text>
                  </View>
                  <View style={{ minHeight: 44, justifyContent: "center" }}>
                    <Switch
                      value={draft.isSealed}
                      onValueChange={(isSealed) =>
                        dispatch({ type: "draft", patch: { isSealed } })
                      }
                      accessibilityLabel="Seal this reading"
                      trackColor={{ false: c.selected, true: c.gold }}
                      thumbColor={draft.isSealed ? c.canvas : c.secondary}
                    />
                  </View>
                </View>
                <Button
                  label="Consult the Observatory"
                  onPress={submit}
                  disabled={!draft.selectedState}
                />
                <Text style={[s.small, s.notice]}>
                  Use fictional entries for this prototype. The Observatory is
                  for creative reflection, not health guidance.
                </Text>
                {__DEV__ && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Test generation failure"
                    onLongPress={() => setForceFailure(true)}
                    delayLongPress={800}
                    style={s.textAction}
                  >
                    <Text style={s.small}>
                      {forceFailure
                        ? "Next reading will test retry"
                        : "Development: hold here to test retry"}
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          )}

          {screen === "generating" && (
            <View style={s.center}>
              <Orb
                state={draft.selectedState}
                size={240}
                animate
                generating
                reduced={reduced}
              />
              <Text
                accessibilityLiveRegion="polite"
                style={[s.body, { marginTop: 40 }]}
              >
                {phase ? "Reading the imagined sky…" : "Aligning instruments…"}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigate("new-reading")}
                style={[s.textAction, { marginTop: 30 }]}
              >
                <Text style={s.link}>Cancel reading</Text>
              </Pressable>
            </View>
          )}

          {screen === "forecast-result" && reading && (
            <ScrollView contentContainerStyle={s.content}>
              <Eyebrow>THE INSTRUMENTS FORECAST</Eyebrow>
              <View style={s.orb}>
                <Orb
                  state={reading.state}
                  size={220}
                  animate
                  reduced={reduced}
                />
              </View>
              <Text accessibilityRole="header" style={[s.title, s.centerText]}>
                {reading.headline}
              </Text>
              <Text style={[s.body, s.centerText]}>
                {reading.interpretation}
              </Text>
              <View
                style={[
                  s.row,
                  {
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginVertical: 24,
                  },
                ]}
              >
                <Chip reading={reading} />
                <View style={[s.chip, s.row]}>
                  <Seal sealed={reading.isSealed} />
                  <Text style={s.small}>
                    {reading.isSealed ? "Sealed reading" : "Open reading"}
                  </Text>
                </View>
              </View>
              {reading.reflection && (
                <View style={[s.card, { marginBottom: 24 }]}>
                  <Eyebrow>FIELD NOTE</Eyebrow>
                  <Text style={s.fieldNote}>“{reading.reflection}”</Text>
                </View>
              )}
              <Button
                label="Return to Observatory"
                onPress={() => navigate("today")}
              />
              <View style={{ height: 12 }} />
              <Button
                secondary
                label="View Weekly Climate"
                onPress={() => navigate("weekly-climate")}
              />
            </ScrollView>
          )}

          {screen === "weekly-climate" && (
            <ScrollView contentContainerStyle={s.content}>
              <Eyebrow>SEVEN-DAY OBSERVATION</Eyebrow>
              <Text style={s.title} accessibilityRole="header">
                Weekly Climate
              </Text>
              <Text style={s.body}>
                A constellation of recorded moments, not a measure of progress.
              </Text>
              <Text style={[s.small, { marginTop: 8 }]}>
                Sept 14–20 · Fictional week
              </Text>
              <Svg
                width="100%"
                height={56}
                viewBox="0 0 350 56"
                accessible={false}
              >
                {week.map((day, i) => {
                  const r = visibleReading(day, state.revealed);
                  const next =
                    week[i + 1] && visibleReading(week[i + 1], state.revealed);
                  const color = r
                    ? EMOTION_STATES.find((e) => e.id === r.state)!.color
                    : c.muted;
                  return (
                    <React.Fragment key={dayId(day)}>
                      {r && next && (
                        <Line
                          x1={20 + i * 51}
                          y1={28}
                          x2={20 + (i + 1) * 51}
                          y2={28}
                          stroke={c.border}
                        />
                      )}
                      <Circle
                        cx={20 + i * 51}
                        cy={28}
                        r={r ? 4 : 2.5}
                        fill={r ? color : "none"}
                        stroke={color}
                      />
                    </React.Fragment>
                  );
                })}
              </Svg>
              <View style={{ gap: 12 }}>
                {week.map((day) => {
                  const id = dayId(day);
                  const r = visibleReading(day, state.revealed);
                  return (
                    <View key={id} style={s.card}>
                      {day.status === "empty" ? (
                        <View style={s.row}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.label}>{day.date}</Text>
                            <Text style={s.small}>No observation recorded</Text>
                          </View>
                          <Orb state={null} size={40} />
                        </View>
                      ) : !r ? (
                        <View>
                          <View style={s.row}>
                            <Seal />
                            <View style={{ flex: 1 }}>
                              <Text style={s.label}>{day.reading.date}</Text>
                              <Text style={s.small}>Sealed reading</Text>
                            </View>
                          </View>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Unseal ${day.reading.date} temporarily`}
                            onPress={() => dispatch({ type: "sheet", id })}
                            style={s.textAction}
                          >
                            <Text style={s.link}>Unseal temporarily</Text>
                          </Pressable>
                        </View>
                      ) : (
                        <>
                          {day.status === "sealed" && (
                            <Text
                              style={[
                                s.small,
                                { color: c.gold, marginBottom: 8 },
                              ]}
                            >
                              Temporarily unsealed
                            </Text>
                          )}
                          <View style={[s.row, { alignItems: "flex-start" }]}>
                            <Orb state={r.state} size={44} />
                            <View style={{ flex: 1 }}>
                              <Text style={s.small}>{r.date}</Text>
                              <Text
                                style={[
                                  s.label,
                                  {
                                    color: EMOTION_STATES.find(
                                      (e) => e.id === r.state,
                                    )!.color,
                                  },
                                ]}
                              >
                                {
                                  EMOTION_STATES.find((e) => e.id === r.state)!
                                    .label
                                }
                              </Text>
                              <Text style={s.cardTitle}>{r.headline}</Text>
                              {r.reflection && (
                                <Text
                                  style={[
                                    s.body,
                                    { fontSize: 14, lineHeight: 21 },
                                  ]}
                                >
                                  “{r.reflection}”
                                </Text>
                              )}
                            </View>
                          </View>
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {screen === "error" && (
            <View style={s.center}>
              <Orb state={null} size={180} />
              <Text style={[s.title, s.centerText]}>
                The instruments lost alignment.
              </Text>
              <Text style={[s.body, s.centerText, { marginBottom: 32 }]}>
                No reading was recorded. Realign the orrery and try again.
              </Text>
              <Button label="Try Again" onPress={submit} />
              <Pressable
                accessibilityRole="button"
                onPress={() => navigate("today")}
                style={s.textAction}
              >
                <Text style={s.link}>Return to Today</Text>
              </Pressable>
            </View>
          )}
        </ScreenReveal>

        {topLevel ? (
          <View style={[s.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            {(
              [
                { to: "today", label: "Today", icon: "☼" },
                { to: "weekly-climate", label: "Climate", icon: "✧" },
              ] as const
            ).map((item) => (
              <Pressable
                key={item.to}
                accessibilityRole="tab"
                accessibilityState={{ selected: screen === item.to }}
                aria-selected={screen === item.to}
                onPress={() => navigate(item.to)}
                style={s.navItem}
              >
                {screen === item.to && <View style={s.indicator} />}
                <Text
                  style={{
                    color: screen === item.to ? c.gold : c.muted,
                    fontSize: 24,
                  }}
                >
                  {item.icon}
                </Text>
                <Text
                  style={[
                    s.small,
                    {
                      color: screen === item.to ? c.gold : c.muted,
                      fontFamily: f.medium,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={{ height: insets.bottom }} />
        )}
      </View>
      <Modal
        visible={!!state.sheet}
        transparent
        animationType={reduced ? "none" : "slide"}
        onRequestClose={() => dispatch({ type: "sheet", id: null })}
      >
        <View style={s.modal}>
          <Pressable
            accessible={false}
            style={StyleSheet.absoluteFill}
            onPress={() => dispatch({ type: "sheet", id: null })}
          />
          <View
            accessibilityViewIsModal
            style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
          >
            <View style={s.handle} />
            <Text accessibilityRole="header" style={s.title}>
              Unseal this reading?
            </Text>
            <Text style={[s.body, { marginBottom: 28 }]}>
              Its forecast and field note will be visible until you leave Weekly
              Climate.
            </Text>
            <Button
              label="Unseal for now"
              onPress={() => dispatch({ type: "reveal" })}
            />
            <View style={{ height: 12 }} />
            <Button
              secondary
              label="Keep sealed"
              onPress={() => dispatch({ type: "sheet", id: null })}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_400Regular_Italic,
  });
  if (!loaded && !error)
    return (
      <View style={[s.root, s.center]}>
        <StatusBar style="light" />
        <Text style={{ color: c.text }}>Opening the observatory…</Text>
      </View>
    );
  return (
    <SafeAreaProvider>
      <StationApp />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.canvas },
  app: { flex: 1, width: "100%", maxWidth: 600, alignSelf: "center" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  wordmark: { fontFamily: f.display, color: c.text, fontSize: 21 },
  back: { minHeight: 44, justifyContent: "center" },
  backText: { fontFamily: f.medium, color: c.gold, fontSize: 15 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },
  eyebrow: {
    fontFamily: f.bold,
    color: c.muted,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    fontFamily: f.display,
    color: c.text,
    fontSize: 34,
    lineHeight: 40,
    marginBottom: 12,
  },
  body: {
    fontFamily: f.body,
    color: c.secondary,
    fontSize: 16,
    lineHeight: 25,
  },
  small: { fontFamily: f.body, color: c.muted, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: f.medium, color: c.text, fontSize: 15, lineHeight: 22 },
  orb: { alignItems: "center", marginVertical: 16 },
  button: {
    backgroundColor: c.gold,
    borderRadius: 16,
    minHeight: 52,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.gold,
    width: "100%",
  },
  buttonText: {
    fontFamily: f.bold,
    color: c.canvas,
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: { backgroundColor: "transparent" },
  disabled: { backgroundColor: c.selected, borderColor: c.selected },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  cardTitle: {
    fontFamily: f.display,
    color: c.text,
    fontSize: 21,
    lineHeight: 27,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: c.selected,
  },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  textAction: {
    minHeight: 44,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    fontFamily: f.medium,
    color: c.gold,
    fontSize: 15,
    textDecorationLine: "underline",
  },
  selectionRow: { gap: 12, paddingVertical: 24, paddingRight: 20 },
  option: {
    width: 100,
    padding: 10,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  optionLabel: {
    fontFamily: f.bold,
    fontSize: 12,
    color: c.secondary,
    lineHeight: 18,
  },
  inputBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  input: {
    minHeight: 120,
    padding: 16,
    fontFamily: f.body,
    fontSize: 15,
    lineHeight: 23,
    color: c.text,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    alignItems: "flex-end",
  },
  notice: { textAlign: "center", marginTop: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  centerText: { textAlign: "center" },
  fieldNote: {
    fontFamily: f.italic,
    fontSize: 21,
    lineHeight: 28,
    color: c.text,
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 64,
    paddingVertical: 7,
  },
  indicator: {
    position: "absolute",
    top: 0,
    height: 2,
    width: 32,
    backgroundColor: c.gold,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(4,5,14,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: c.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: c.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
});
