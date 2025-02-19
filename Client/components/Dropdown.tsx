import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';

const BudgetPlan_data = [
  {
    value: '1',
    lable: 'item 1',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '2',
    lable: 'Country 2',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '3',
    lable: 'Country 3',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '4',
    lable: 'Country 4',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '5',
    lable: 'Country 5',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
];

const SelectBudgetPlanScreen = (_props: any) => {
  const [BudgetPlan, setBudgetPlan] = useState('');


  return (
    <SelectCountry
    containerStyle={{ width: 340, height: 200, marginTop: 110 , marginLeft: 2}}
      mode='default'
      dropdownPosition = 'bottom'
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      imageStyle={styles.imageStyle}
      iconStyle={styles.iconStyle}
      maxHeight={200}
      value={BudgetPlan}
      data={BudgetPlan_data}
      valueField="value"
      labelField="lable"
      imageField="image"
      placeholder="Select Your Budget Plan"
      searchPlaceholder="Search..."
      onChange={e => {
        setBudgetPlan(e.value);
      }}
    />
  );
};

export default SelectBudgetPlanScreen;

const styles = StyleSheet.create({
  dropdown: {
    margin: 8,
    height: 40,
    width: 340,
    padding: 12,
    backgroundColor: '#EEEEEE',
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