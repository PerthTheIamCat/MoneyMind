import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
  } from "react-native";
  import React, { useCallback, useState , useMemo } from "react";
  import { AntDesign } from "@expo/vector-icons";
  import { useColorScheme } from "react-native";
  type OptionItem = {
    value: string;
    label: string;
  };
  
  interface DropDownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
  }

  
  export default function Dropdownfiller({
    data,
    onChange,
  }: DropDownProps) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
    const [value, setValue] = useState("ALL");
    // const [colortext, setColor] = useState(0);
    const theme = useColorScheme() || "light";
    const componentColor = theme === "dark" ? "#181818" : "#d8d8d8";
    const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
    const onSelect = useCallback((item: OptionItem) => {
      onChange(item);
      setValue(item.label);
      setExpanded(false);
    }, []);


const colortext = useMemo(() => {
    if (value.toLowerCase() === "income") return "green";
    if (value.toLowerCase() === "expense") return "red";
    return componentIcon;
    }, [value, componentIcon]);

  const styles = StyleSheet.create({
    backdrop: {
      padding: 10,
      justifyContent: "center",
      alignItems: "flex-end",
      marginTop:325
    },
    optionItem: {
      height: 40,
      justifyContent: "flex-end",
      alignItems:"flex-end",
    //   backgroundColor: "blue",
      width: "100%",
      padding:9,
    },
    separator: {
      height: 4,
    },
    options: {
      backgroundColor: componentColor,
      width: "30%",
      marginTop:10,
      marginEnd:10,
      paddingEnd:10,
      borderRadius: 6,
      maxHeight: 260,
    },
    text: {
      fontWeight:"bold",
      fontSize: 17,
      opacity: 0.8,
      color: componentIcon,
    },
    textselect: {
        fontWeight:"bold",
        fontSize: 17,
        opacity: 0.8,
        color: colortext,
      },
    button: {
      height: 50,
      gap:10,
      paddingTop:4,
      paddingEnd:10,
      justifyContent: "flex-end",
    //   backgroundColor: componentColor,
      flexDirection: "row",
      width: "55%",
      alignItems: "center",
      borderRadius: 8,
    },
  });

    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          <Text style={styles.textselect}>{value}</Text>
          <AntDesign name={expanded ? "caretup" : "caretdown"} color={componentIcon}/>
        </TouchableOpacity>
        {expanded ? (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View style={styles.backdrop}>
                <View
                  style={styles.options}>
                  <FlatList
                    keyExtractor={(item) => item.value}
                    data={data}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.optionItem}
                        onPress={() => onSelect(item)}
                      >
                        <Text style={styles.text}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}
      </View>
    );
  }
