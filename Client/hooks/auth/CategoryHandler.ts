import axios from "axios";

interface Category {
  user_id: number;
  icon_name: string;
  icon_id: string;
  category_type: "income" | "expense";
}

interface CategoryResponse {
  id: number;
  user_id: number;
  icon_name: string;
  icon_id: string;
  category_type: "income" | "expense";
  status: boolean;
  message: string;
}

export const deleteCategory = async (url: string, id: string) => {
  try {
    const response = await axios.delete(`${url}/category/${id}`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (url: string, category: Category) => {
  try {
    const response = await axios.post(`${url}/category`, {
      category: category,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCategory = async (url: string) => {
  try {
    const response = await axios.get<CategoryResponse>(`${url}/category`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
