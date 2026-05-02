// Register all routes
router.register("/", renderHome);
router.register("/home", renderHome);
router.register("/room/:id", renderRoomDetail);
router.register("/admin", renderAdminDashboard);
router.register("/admin-login", renderAdminLogin);
router.register("/owner-login", renderOwnerLogin);
router.register("/owner-signup", renderOwnerSignup);
router.register("/owner-dashboard", renderOwnerDashboard);

// Start the app
document.addEventListener("DOMContentLoaded", () => {
  router.start();
});
