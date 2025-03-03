import { ThemedText } from "@/components/ThemedText";

import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { Image } from "expo-image";
import { View, TouchableWithoutFeedback } from "react-native";
import { useColorScheme, StyleSheet } from "react-native";
import { useState, useContext, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { GetUserBank, UpdateUserBank } from "@/hooks/auth/GetUserBank";

const CircleSize = 40;
const CircleRingSize = 2;
const colors = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9844A",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#4D908E",
  "#577590",
  "#277DA1",
];

const AccountIconSize = [
  {
    source: require("../assets/images/Add_Account_page_image/AccountIcon1.png"),
  },
  {
    source: require("../assets/images/Add_Account_page_image/AccountIcon2.png"),
  },
  {
    source: require("../assets/images/Add_Account_page_image/AccountIcon3.png"),
  },
];

export default function edit_page() {
  const { URL } = useContext(ServerContext);
  const { userID, setBank, bank } = useContext(UserContext);
  const auth = useContext(AuthContext);
  const theme = useColorScheme();

  const [AccountName, setAccountName] = useState<string>("");
  const [errorAccountName, setErrorAccountName] = useState<string>("");
  const [AccountBalance, setAccountBalance] = useState<string>("");
  const [errorAccountBalance, setErrorAccountBalance] = useState<string>("");

  const [selectedIndexError, setSelectedIndexError] = useState<boolean>(false);
  const [selectedColorError, setSelectedColorError] = useState<boolean>(false);

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);

  const { CardID } = useLocalSearchParams();

  const validateInputs = () => {
    let valid = true;
    setErrorAccountName("");
    setErrorAccountBalance("");
    setSelectedColorError(false);
    setSelectedIndexError(false);

    // Check if AccountName and AccountBalance are empty
    if (AccountName.trim().length === 0) {
      setErrorAccountName("Account Name is required");
      valid = false;
    }

    if (AccountBalance.trim().length === 0) {
      setErrorAccountBalance("Account Balance is required");
      valid = false;
    }

    if (selectedColor === null || selectedColor === undefined) {
      setSelectedColorError(true);
      valid = false;
    }

    if (selectedIcon === null || selectedIcon === undefined) {
      setSelectedIndexError(true);
      valid = false;
    }

    return valid;
  };
  const reloadBank = () => {
    GetUserBank(URL, userID!, auth?.token!).then((res) => {
      if (res.success) {
        setBank(res.result);
      }
    });
  };
  
  const updateAccount = async () => {
    if (!validateInputs()) return;
  
    if (!CardID) {
      console.error("❌ No account selected for update.");
      return;
    }
  
    try {
      const updatedAccount = {
        user_id: userID!,
        account_name: AccountName,
        balance: parseFloat(AccountBalance),
        color_code: colors[selectedColor!],
        icon_id: `${selectedIcon!}`,
      };
  
      console.log("🔄 Updating account with data:", updatedAccount);
  
      // ✅ แปลง `CardID` เป็นตัวเลขก่อนส่ง
      const response = await UpdateUserBank(URL, Number(CardID), updatedAccount, auth?.token!);
  
      if (response.success) {
        console.log("✅ Successfully updated bank data:", response.result);
        setBank(response.result); // อัปเดต state ทันที
  
        // ✅ โหลดข้อมูลบัญชีใหม่หลังจากอัปเดต
        await reloadBank();
  
        router.replace("/(tabs)/transaction"); // กลับไปหน้าธุรกรรม
      } 
    } catch (error) {
      console.error("❌ Error updating account:", error);
    }
  };

  const getIconIndex = (iconId: string | number) => {
    if (typeof iconId === "number") {
      return iconId; // ถ้า API ส่งเป็นตัวเลขตรงๆ ใช้ค่าเดิม
    }
    
    const match = iconId.match(/\d+/);
    return match ? parseInt(match[0], 10) - 1 : 0; // แปลงเป็น index ที่เริ่มจาก 0
  };
  
    
  useEffect(() => {
    if (!bank || !CardID) return;
  
    const accountToEdit = bank.find((item) => item.id === Number(CardID));
  
    if (accountToEdit) {
      setAccountName(accountToEdit.account_name);
      setAccountBalance(accountToEdit.balance.toString());
      setSelectedColor(colors.indexOf(accountToEdit.color_code));
  
      console.log("🔍 Icon ID from API:", accountToEdit.icon_id);
  
      // ✅ ใช้ฟังก์ชันแปลง icon_id ให้ถูกต้อง
      const matchedIconIndex = getIconIndex(accountToEdit.icon_id);
  
      if (matchedIconIndex >= 0 && matchedIconIndex < AccountIconSize.length) {
        console.log("✅ Found matching icon:", matchedIconIndex);
        setSelectedIcon(matchedIconIndex);
      } else {
        console.warn("⚠️ No matching icon found, defaulting to first icon.");
        setSelectedIcon(0);
      }
    }
  }, [CardID, bank]);
  
  
  

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedView className="w-96 mt-5 px-5 gap-5">
          <ThemedInput
            title="Account Name"
            error={errorAccountName}
            className="w-full"
            onChangeText={(text) => setAccountName(text)} // ✅ ใช้ useState แทน
            value={AccountName} // ✅ ใช้ค่าจาก state ที่อัปเดตเสมอ
          />

          <ThemedScrollView
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 5,
              paddingBottom: 0,
            }}
            showsHorizontalScrollIndicator={false}
          >
            <ThemedView className="flex-row gap-10">
              <View
                style={styles.group}
                className={`${
                  selectedIndexError ? "border-red-500 border-2" : ""
                }`}
              >
                {AccountIconSize.map((item, index) => {
                  const isActive = selectedIcon === index;
                  return (
                    <View key={index}>
                      <TouchableWithoutFeedback
                        onPress={() => setSelectedIcon(index)}
                      >
                        <ThemedView
                          style={[
                            styles.square,
                            {
                              borderColor: isActive ? "#AACC00" : "transparent",
                              borderWidth: isActive ? 3 : 1,
                            },
                          ]}
                        >
                          <Image
                            source={item.source}
                            style={{
                              width: 100,
                              height: 100,
                              margin: 10,
                              marginTop: 15,
                            }}
                          />
                        </ThemedView>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                })}
              </View>
            </ThemedView>
          </ThemedScrollView>

          <ThemedInput
            title="Account Balance"
            error={errorAccountBalance}
            className="w-full"
            keyboardType="numeric" // ✅ ให้กรอกเฉพาะตัวเลข
            onChangeText={(text) => setAccountBalance(text)} // ✅ ใช้ `useState` ให้ค่าอัปเดต
            value={AccountBalance} // ✅ ใช้ค่าจาก `useState`
          />
          <ThemedText
            className="text-center font-bold w-full"
            style={{ fontSize: 20 }}
          >
            Select a color for the account
          </ThemedText>
          <ThemedScrollView
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <ThemedView className="flex-row gap-10">
              <View
                style={styles.group}
                className={`${
                  selectedColorError ? "border-red-500 border-2" : ""
                }`}
              >
                {colors.map((color, index) => {
                  const isActive = selectedColor === index;
                  return (
                    <View key={color}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setSelectedColor(index);
                        }}
                      >
                        <ThemedView
                          style={[
                            styles.circle,
                            isActive && {
                              borderColor: color,
                              transform: [{ scale: 1.2 }],
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.circleInside,
                              { backgroundColor: color },
                            ]}
                          />
                        </ThemedView>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                })}
              </View>
            </ThemedView>
          </ThemedScrollView>

          <ThemedButton
            className="w-36 h-14"
            mode="confirm"
            onPress={updateAccount}
          >
            Save
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  group: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: "transparent",
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  sheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  sheetBody: {
    padding: 24,
  },
  /** Profile */
  profile: {
    alignSelf: "center",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  profileText: {
    fontSize: 34,
    fontWeight: "600",
    color: "white",
  },
  /** Circle */
  circle: {
    width: CircleSize + CircleRingSize * 4,
    height: CircleSize + CircleRingSize * 4,
    borderRadius: 9999,
    backgroundColor: "#f1f1f1",
    borderWidth: CircleRingSize,
    marginRight: 8,
    marginBottom: 12,
  },
  circleInside: {
    width: CircleSize,
    height: CircleSize,
    borderRadius: 9999,
    position: "absolute",
    top: CircleRingSize,
    left: CircleRingSize,
  },
  /** Button */
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    marginBottom: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  square: {
    width: 101,
    height: 101,
    backgroundColor: "trasparent",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "trasparent",
  },
});
