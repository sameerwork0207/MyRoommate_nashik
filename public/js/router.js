class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.app = document.getElementById("app");
    window.addEventListener("popstate", () => this.handleNavigation());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path, state = {}) {
    window.history.pushState(state, "", path);
    this.handleNavigation();
  }

  handleNavigation() {
    const path = window.location.pathname || "/";
    const route = this.getRoute(path);

    if (route) {
      this.currentRoute = path;
      this.app.innerHTML = "";
      route.handler();
    } else {
      this.app.innerHTML = "<div class='container'><p>Page not found</p></div>";
    }
  }

  getRoute(path) { 
    // Exact match
    if (this.routes[path]) {
      return { handler: this.routes[path] };
    }

    // Dynamic match for /room/:id
    if (path.startsWith("/room/")) {
      if (this.routes["/room/:id"]) {
        return { handler: this.routes["/room/:id"] };
      }
    }

    return null;
  }

  start() {
    this.handleNavigation();
  }
}

const router = new Router();

// Helper to show messages
function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  const app = document.getElementById("app");
  app.insertBefore(messageDiv, app.firstChild);

  setTimeout(() => messageDiv.remove(), 3000);
}
