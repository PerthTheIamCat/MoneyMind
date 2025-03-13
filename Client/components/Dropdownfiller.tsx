import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
  } from "react-native";
  import React, { useCallback, useState , useMemo ,useRef } from "react";
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
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [value, setValue] = useState("ALL");
    // const [colortext, setColor] = useState(0);
    const theme = useColorScheme() || "light";
    const componentColor = theme === "dark" ? "#383838" : "#e8e8e8";
    const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
    const onSelect = useCallback((item: OptionItem) => {
      onChange(item);
      setValue(item.label);
      setExpanded(false);
    }, []);
    const buttonRef = useRef<TouchableOpacity>(null);

    const toggleExpanded = () => {
      if (!expanded && buttonRef.current) {
        buttonRef.current.measureInWindow((x, y, width, height) => {
          setDropdownPosition({ top: y + height, left: x, width });
          setExpanded(true);
        });
      } else {
        setExpanded(false);
      }
    };
  const colortext = useMemo(() => {
      if (value.toLowerCase() === "income") return "green";
      if (value.toLowerCase() === "expense") return "red";
      return componentIcon;
      }, [value, componentIcon]);

  const styles = StyleSheet.create({
    backdrop: {
      position: "absolute",
      top: dropdownPosition.top,
      left: dropdownPosition.left,
      width: dropdownPosition.width,
      // backgroundColor: "white",
      // padding: 10,
      borderRadius: 5,
      // marginEnd:10,
    },
    optionItem: {
      justifyContent: "flex-end",
      alignItems:"flex-end",
      
      marginTop:10,
      // marginEnd:10,
      // padding:9,
    },
    separator: {
      height: 4,
    },
    options: {
      backgroundColor: componentColor,
      // marginEnd:20,
      paddingEnd:15,
      borderRadius: 9,
    },
    text: {
      fontWeight:"bold",
      fontSize: 17,
      opacity: 0.8,
      paddingBottom:10,
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
          ref={buttonRef}
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
