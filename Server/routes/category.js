const express = require("express"); // Import express
const router = express.Router(); // Create express app
require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const {
  router: authRouter,
  jwtValidate,
  getUserIDbyusername,
  getUserIDbyemail,
} = require("./auth");
const db = require("./db");

router.post("/create", jwtValidate, (req, res) => {
    const {user_id, icon_name, icon_id, category_type} = req.body

    console.log("DATA:", user_id, icon_name, icon_id, category_type)

    if(!user_id || !icon_name || !icon_id || !category_type){
        console.log("Please fill all fields")
        return res.status(400).json({message: "Please fill all fields", success: false});
    }

    if (req.user.UserID !== user_id) {
        //user_id
        console.log("Unauthorized user")
        return res
          .status(403)
          .json({ message: "Unauthorized user", success: false });
    }

    if(category_type != 'income' && category_type != 'expense'){
        console.log("Category type can be income or expense only!")
        return res.status(400).json({message: "Category type can be income or expense only!", success: false});
    }

    db.query(
        'INSERT INTO category (user_id, icon_name, icon_id, category_type) VALUES (?, ?, ?, ?)',
        [user_id, icon_name, icon_id, category_type],
        (err, result) => {
            if (err) {
                console.log('Error from .post/category/create INSERT INTO category (user_id, icon_name, icon_id, category_type) VALUES (?, ?, ?, ?)')
                console.log("Error:", err)
                return res.status(500).json({
                    message: "Database query failed",
                    error: err.message,
                    success: false,
                });
            }

            console.log("Create user category successfully.")
            return res.status(201).json({result, message: "Create user category successfully.", success: true})
        }
    )

});

router.get("/:id", jwtValidate, (req, res) => { //user_id
  if (req.user.UserID !== parseInt(req.params.id, 10)) {
    //user_id
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query(
    "SELECT * FROM category WHERE user_id = ?",
    [req.params.id],
    (err, result) => {
      //user_id
      if (err) {
        console.log('Error from .get/gategory SELECT * FROM category WHERE user_id = ?')
        console.log('Database query failed')
        console.log('Error:', err)
        return res
          .status(500)
          .json({
            message: "Database query failed",
            error: err.message,
            success: false,
          });
      }

      if (result.length === 0) {
        console.log("Category not found")
        return res
          .status(404)
          .json({ message: "Category not found", success: false });
      }

      console.log('Get category successfully')
      return res.status(200).json({ result, message: 'Get category successfully', success: true });
    }
  );
});

router.put('/:id', jwtValidate,(req, res) => { //category_id
    const {icon_name, icon_id, category_type} = req.body

    if(!icon_name || !icon_id || !category_type){
        console.log("Please fill all fields")
        return res.status(400).json({message: "Please fill all fields", success: false});
    }

    if(category_type != 'income' && category_type != 'expense'){
        console.log("Category type can be income or expense only!")
        return res.status(400).json({message: "Category type can be income or expense only!", success: false});
    }

    db.query(
        'UPDATE category SET icon_name = ?, icon_id = ?, category_type = ? WHERE id = ? AND user_id = ?', 
        [icon_name, icon_id, category_type, req.params.id, req.user.UserID], 
        (err, result) => {
            if (err) {
                console.log('Error from .put/gategory UPDATE category SET icon_name = ?, icon_id = ?, category_type = ? WHERE id = ? AND user_id = ?')
                console.log('Database query failed')
                console.log('Error:', err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Category not found")
                return res
                  .status(404)
                  .json({ message: "Category not found", success: false });
            }

            console.log('Device updated')
            return res.status(200).json({result, message: 'Device updated', success: true });
        }
    )
})

router.delete("/:id", jwtValidate, (req, res) => { //category_id
  const { user_id } = req.body;

  if (req.user.UserID !== user_id) {
    //user_id
    console.log("Unauthorized user")
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query(
    "DELETE FROM category WHERE id = ?",
    [req.params.id],
    (err, result) => {
      //noti_id
      if (err) {
        console.log('Error from .delete/gategory DELETE FROM category WHERE id = ?')
        console.log('Database query failed')
        console.log('Error:', err)
        return res
          .status(500)
          .json({
            message: "Database query failed",
            error: err.message,
            success: false,
          });
      }

      if (result.length === 0) {
        console.log("Category not found")
        return res
          .status(404)
          .json({ message: "Category not found", success: false });
      }

      console.log('Delete category successfully')
      res.status(200).json({result, message: "Delete category successfully", success: true });
    }
  );
});

module.exports = {
  router,
};
