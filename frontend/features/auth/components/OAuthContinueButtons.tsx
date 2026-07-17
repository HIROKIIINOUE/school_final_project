import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { OAuthProviderId } from '../types/provider.type';

type Props = {
  providers: OAuthProviderId[]
}

const OAuthContinueButtons = (props: Props) => {
  const { providers } = props;
  const labelByProvider: Record<OAuthProviderId, string> = {
    apple: "Continue with Apple",
    google: "Continue with Google"
  }
  return (
    <View style={styles.container}>
      {providers.map(provider => {
        const label = labelByProvider[provider]
        const isLast = provider === providers[providers.length - 1]
        return (
          <Pressable
            key={provider}
            accessibilityRole='button'
            style={({ pressed }) => [
              styles.button,
              !isLast && styles.buttonSpacing,
              pressed && styles.buttonPressed,
            ]}
          >
            {provider === "google" ? (
              <AntDesign name="google" size={18} color="#0f172a" />
            ) : (
              <AntDesign name="apple" size={18} color="#0f172a" />
            )}
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.buttonLabel}
            >
              {label}
            </Text>
          </Pressable>
        )
      }
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    minHeight: 58,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7e1ee',
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#94a3b8',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  buttonSpacing: {
    marginBottom: 14,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },
  buttonLabel: {
    marginLeft: 12,
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
});

export default OAuthContinueButtons
