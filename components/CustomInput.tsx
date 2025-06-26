import { TextInput } from "react-native";

export default function CustomInput({
  placeholder,
  placeholderTextColor,
  secureTextEntry = false,
  onChangeText,
  value,
  style = {},
}) {
  const defaultStyle = {
    borderWidth: 1,
    borderColor: "#1ED2AF",
    padding: 20,
    width: "100%",
    borderRadius: 5,
  };

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={placeholderTextColor}
      style={{ ...defaultStyle, ...style }}
    />
  );
}
