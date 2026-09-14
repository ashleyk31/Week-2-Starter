import React, { useEffect, useId, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  G,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { EMOTION_STATES, type EmotionStateId } from "./data";

export default function Orb({
  state,
  size = 260,
  animate = false,
  reduced = false,
  generating = false,
}: {
  state: EmotionStateId | null;
  size?: number;
  animate?: boolean;
  reduced?: boolean;
  generating?: boolean;
}) {
  const id = useId().replace(/[^a-z0-9]/gi, "");
  const color = EMOTION_STATES.find((e) => e.id === state)?.color ?? "#363A5A";
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    rotation.setValue(0);
    if (!animate || reduced) return;
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: generating ? 1800 : state === "solar-flare" ? 12000 : 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [animate, reduced, generating, state, rotation]);
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox="0 0 280 280">
        <Defs>
          <RadialGradient id={`glow${id}`}>
            <Stop offset="0" stopColor={color} stopOpacity={0.3} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {Array.from({ length: 22 }, (_, i) => {
          const a = i * 2.399;
          return (
            <Circle
              key={i}
              cx={140 + Math.cos(a) * (105 + (i % 4) * 9)}
              cy={140 + Math.sin(a) * (105 + (i % 4) * 9)}
              r={i % 3 === 0 ? 1 : 0.65}
              fill="#F4F1E8"
              opacity={state ? 0.55 : 0.2}
            />
          );
        })}
        <Circle cx={140} cy={140} r={65} fill={`url(#glow${id})`} />
      </Svg>
      <Animated.View
        style={{
          position: "absolute",
          inset: 0,
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {[
            { rx: 120, ry: 41, a: 18 },
            { rx: 90, ry: 30, a: -12 },
            { rx: 62, ry: 20, a: 7 },
          ].map((o, i) => (
            <G key={i} rotation={o.a} origin="140,140">
              <Ellipse
                cx={140}
                cy={140}
                rx={o.rx}
                ry={o.ry}
                stroke={color}
                strokeWidth={0.75 + i * 0.25}
                opacity={0.32 + i * 0.16}
                fill="none"
              />
              <Circle cx={140 + o.rx} cy={140} r={1.8} fill={color} />
            </G>
          ))}
          {state === "frostbound" &&
            [0, 60, 120, 180, 240, 300].map((a) => (
              <Line
                key={a}
                x1={254}
                y1={140}
                x2={264}
                y2={140}
                rotation={a}
                origin="140,140"
                stroke={color}
              />
            ))}
        </Svg>
      </Animated.View>
      <Svg
        style={{ position: "absolute", inset: 0 }}
        width={size}
        height={size}
        viewBox="0 0 280 280"
      >
        <Defs>
          <RadialGradient id={`orb${id}`} cx="35%" cy="30%" r="75%">
            <Stop offset="0" stopColor={color} stopOpacity={0.95} />
            <Stop offset="0.55" stopColor={color} stopOpacity={0.55} />
            <Stop offset="1" stopColor={color} stopOpacity={0.12} />
          </RadialGradient>
        </Defs>
        {state === "sunlit" &&
          [36, 44].map((r) => (
            <Circle
              key={r}
              cx={140}
              cy={140}
              r={r}
              stroke={color}
              opacity={0.22}
              fill="none"
            />
          ))}
        {(state === "temperate" || state === "solar-flare") && (
          <Path
            d="M 86 152 Q 140 104 194 152"
            stroke={color}
            strokeWidth={state === "temperate" ? 7 : 2}
            opacity={0.18}
            fill="none"
          />
        )}
        {state === "mistbound" &&
          [32, 36, 40].map((r) => (
            <Ellipse
              key={r}
              cx={140}
              cy={140}
              rx={r + 20}
              ry={r / 3}
              stroke={color}
              strokeWidth={4}
              opacity={0.07}
              fill="none"
            />
          ))}
        <Circle cx={140} cy={140} r={28} fill={`url(#orb${id})`} />
        <Circle cx={132} cy={131} r={8} fill="white" opacity={0.1} />
        {state === "mistbound" ? (
          <Path
            d="M140 129 A11 11 0 1 1 140 151 A6 6 0 1 0 140 129"
            fill={color}
          />
        ) : state === "temperate" ? (
          <G stroke={color} strokeWidth={1.5} fill="none">
            <Ellipse cx={135} cy={140} rx={7} ry={5} />
            <Ellipse cx={145} cy={140} rx={7} ry={5} />
          </G>
        ) : state === "solar-flare" ? (
          <G>
            <Circle cx={144} cy={136} r={5.5} fill={color} />
            <Path
              d="M139 142 Q129 150 126 153"
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
          </G>
        ) : (
          state && (
            <G stroke={color} strokeWidth={1.5}>
              {(state === "frostbound" ? [0, 60, 120] : [0, 45, 90, 135]).map(
                (a) => (
                  <Line
                    key={a}
                    x1={129}
                    y1={140}
                    x2={151}
                    y2={140}
                    rotation={a}
                    origin="140,140"
                  />
                ),
              )}
            </G>
          )
        )}
      </Svg>
    </View>
  );
}
