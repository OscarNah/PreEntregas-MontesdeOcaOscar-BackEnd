const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const { authenticateAdmin } = require("../middleware/authAdmin.js");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
// Admin
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
// GitHub
router.get("/auth/github", userController.githubAuth);
router.get("/auth/github/callback", userController.githubAuthCallback);
// Integradora 3
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.put("/premium/:uid", userController.cambiarRolPremium);
// Integradora 4: Endpoint para subir documentos
const upload = require("../middleware/multer.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const checkUserRole = require("../middleware/checkrole.js");
router.post(
   "/:uid/documents",
   upload.fields([
      { name: "profile", maxCount: 1 },
      { name: "products", maxCount: 10 },
      { name: "document", maxCount: 3 },
   ]),
   userController.subirDocumentos
);
//Entrega Final
// Obtener todos los usuarios
router.get("/", userController.getAllUsers);
// Eliminar usuarios inactivos
router.delete("/", userController.deleteInactiveUsers);
// Obtener la vista de administración de usuarios
router.get("/admin", authMiddleware, checkUserRole(['admin']), userController.getUserAdminView);
// Cambiar el rol de un usuario
router.put("/admin/:uid/role", authenticateAdmin, userController.changeUserRole);
// Eliminar un usuario
router.delete("/admin/:uid", authenticateAdmin, userController.deleteUser);

module.exports = router;
