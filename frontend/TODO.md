# Toggle Sidebar Implementation Plan

## Steps:
- [x] Step 1: Update AdminLayout.jsx - rename state to sidebarOpen, update toggle logic, apply dynamic classes `open`/`shifted`, simplify mobile logic.
- [x] Step 2: Update AdminLayout.css - set sidebar width 250px, hide by default ALL screens (translateX(-100%)), .open shows, .shifted margin-left:250px for header/main, overlay on open, smooth transitions.
- [x] Step 3: Review AdminSidebar.jsx - ensure class compatibility.
- [ ] Step 4: Test toggle on desktop/mobile, verify layout shift, footer visibility.
- [ ] Step 5: Complete task.

Current: Step 4 (Layout + CSS implemented; test in browser: cd frontend && npm run dev, visit /admin/dashboard)
