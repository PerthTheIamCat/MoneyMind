import React, { useState, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import { ThemedView } from "./ThemedView";
import { getSplitpay } from "@/hooks/auth/SplitpayHandler";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";

const BudgetPlan_data = [
  {
    value: "1",
    lable: "item 1",
    image: {
      uri: "https://www.vigcenter.com/public/all/images/default-image.jpg",
    },
  },
  {
    value: "2",
    lable: "Country 2",
    image: {
      uri: "https://www.vigcenter.com/public/all/images/default-image.jpg",
    },
  },
  {
    value: "3",
    lable: "Country 3",
    image: {
      uri: "https://www.vigcenter.com/public/all/images/default-image.jpg",
    },
  },
  {
    value: "4",
    lable: "Country 4",
    image: {
      uri: "https://www.vigcenter.com/public/all/images/default-image.jpg",
    },
  },
  {
    value: "5",
    lable: "Country 5",
    image: {
      uri: "https://www.vigcenter.com/public/all/images/default-image.jpg",
    },
  },
];

interface SplitpayData {
  id: number | null;
  user_id: number;
  account_id: number;
  split_name: string;
  amount_allocated: number;
  remaining_balance: number;
  color_code: string;
  icon_id: number;
}

const SelectBudgetPlanScreen = ({
  account_id,
  onChange,
}: {
  account_id: number;
  onChange: (id: number) => void;
}) => {
  console.log("account_id", account_id);
  const [BudgetPlanData, setBudgetPlanData] = useState<SplitpayData[]>([]);
  const [BudgetPlanSelected, setBudgetPlanSelected] = useState<SplitpayData[]>(
    []
  );
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  useEffect(() => {
    async function fetchData() {
      const response = await getSplitpay(URL, account_id, auth?.token!);
      if (response.success && "result" in response) {
        setBudgetPlanData(response.result);
        setBudgetPlanData((prev) => [
          {
            id: null,
            user_id: 0,
            account_id: 0,
            split_name: "Select Budget Plan",
            amount_allocated: 0,
            remaining_balance: 0,
            color_code: "0",
            icon_id: -1,
          },
          ...prev,
        ]);
      }
      if (
        response.result.length > 0 &&
        response.result[0].split_name === "Retirement"
      ) {
        setBudgetPlanSelected([response.result[0]]);
      }
    }
    fetchData();
  }, [account_id]);

  return (
    <ThemedView className="bg-transparent">
      <SelectCountry
        containerStyle={{
          width: 340,
          height: "auto",
          marginTop: 115,
          zIndex: 9999,
          elevation: 10,
          borderRadius: 15,
        }}
        mode="default"
        dropdownPosition="bottom"
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        imageStyle={styles.imageStyle}
        iconStyle={styles.iconStyle}
        maxHeight={200}
        value={BudgetPlanSelected}
        data={BudgetPlanData}
        valueField="id"
        labelField="split_name"
        imageField="icon_id"
        placeholder="Select Your Budget Plan"
        searchPlaceholder="Search..."
        onChange={(e) => {
          setBudgetPlanSelected(e.id);
          onChange(e.id);
        }}
      />
    </ThemedView>
  );
};

export default SelectBudgetPlanScreen;

const styles = StyleSheet.create({
  dropdown: {
    margin: 8,
    height: 40,
    width: 340,
    padding: 12,
    backgroundColor: "#EEEEEE",
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
