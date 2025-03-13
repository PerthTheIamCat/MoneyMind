import axios from "axios";

interface Category {
  user_id: number;
  icon_name: string;
  icon_id: string;
  category_type: "income" | "expense";
}

interface CategoryResponse {
  result: {
    id: number;
    user_id: number;
    icon_name: string;
    icon_id: string;
    category_type: "income" | "expense";
  };
  success: boolean;
  message: string;
}

export const deleteCategory = async (
  url: string,
  category_id: number,
  user_id: number,
  token: string
) => {
  try {
    const response = await axios.delete(`${url}/category/${category_id}`, {
      data: { user_id: user_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (
  url: string,
  category: Category,
  token: string
) => {
  try {
    console.log(category);
    const response = await axios.post<CategoryResponse>(
      `${url}/category/create`,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCategory = async (
  url: string,
  user_id: number,
  token: string
) => {
  try {
    const response = await axios.get<CategoryResponse>(
      `${url}/category/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
