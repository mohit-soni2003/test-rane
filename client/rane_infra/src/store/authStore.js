import { create } from "zustand";
import axios from "axios"
import { backend_url } from "./keyStore";

const API_URL = backend_url;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: false,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	role: null,

	signup: async (email, password, name) => {
		// Set loading state and clear errors
		set({ isLoading: true, error: null });

		try {
			// Send the POST request using fetch
			const response = await fetch(`${API_URL}/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password, name }),
				credentials: "include", // Ensures cookies are included in cross-origin requests
				withCredntials: true,
			});

			// Check if the response is okay
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Error signing up");
			}

			// Parse the JSON response
			const data = await response.json();
			console.log(data);
			if (data.message) {
				set({ user: data.user, isLoading: false });
			}
			else {
				set({ error: data.error, isLoading: false });
			}
		} catch (error) {
			console.error("Error signing up:", error.message);
		} finally {
			// Reset the loading state
			set({ isLoading: false });
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await fetch(`${API_URL}/signin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
				credentials: "include", // Ensures cookies are sent with the request
			});

			const datal = await response.json();

			if (datal.message) {
				console.log("1")
				set({
					isAuthenticated: true,
					user: datal.user,
					error: null,
					isLoading: false,
					role:datal.user.role
				});
				return true
			} else {
				set({
					error: datal.error || "Login failed",
					isLoading: false,
				});
				return false
			}
		} catch (error) {
			set({ error: error.message || "Error logging in", isLoading: false });
			throw error;
		}

	},
	// adminlogin: async (email, password) => {
	// 	set({ isLoading: true, error: null });
	// 	try {
	// 		const response = await fetch(`${API_URL}/admin-login`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ email, password }),
	// 			credentials: "include", // Ensures cookies are sent with the request
	// 		});

	// 		const datal = await response.json();

	// 		if (datal.message) {
	// 			console.log("admin logged in")
	// 			set({
	// 				isAuthenticated: true,
	// 				user: datal.user,
	// 				error: null,
	// 				isLoading: false,
	// 				isAdmin: true,
	// 			});
	// 			return true
	// 		} else {
	// 			set({
	// 				error: datal.error || "Login failed",
	// 				isLoading: false,
	// 			});
	// 			return false
	// 		}
	// 	} catch (error) {
	// 		set({ error: error.message || "Error logging in", isLoading: false });
	// 		throw error;
	// 	}

	// },

	logout: async () => {
		 
			try {
			  const response = await fetch(`${backend_url}/logout`, {
				method: "POST",
				credentials: "include", // Include cookies in the request
			  });
		
			  if (response.ok) {
				const result = await response.json();
				console.log(result.message); // Optional: Display a success message in the console
				return true
			  } else {
				const errorData = await response.json();
				console.error("Logout failed:", errorData.error);
				alert("Failed to logout. Please try again.");
				return false
			  }
			} catch (error) {
			  console.error("Error during logout:", error.message);
			  alert("An error occurred while logging out. Please try again.");
		  };

		
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await fetch(`${API_URL}/verify-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code }),
			});


			const verifyEmailData = await response.json();
			console.log(verifyEmailData)
			if (verifyEmailData.message) {
				set({ user: verifyEmailData.user, isLoading: false });
				set({ isAuthenticated: true, isLoading: false });
				console.log("user set")
				return true
				// navigate("/signin")
			}
			else {
				set({ error: verifyEmailData.error, isLoading: false });
				console.log("error set")
				return false
			}

		} catch (error) {
			set({ isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await fetch(`${API_URL}/check-auth`, {
				method: "GET",
				credentials: "include", // Send cookies if needed
			});

			if (!response.ok) {
				throw new Error("Authentication check failed");
			}

			const data1 = await response.json();
			console.log("Response JSON:", data1);

			if (data1.user?.role) {

				set({ role: data1.user.role, user: data1.user, isAuthenticated: true, isCheckingAuth: false,  });
				console.log(data1.user.role)
			}
			else {
				set({ isAuthenticated: false, isCheckingAuth: false, error: data1.error });
				console.log("No user found in response");
			}
		} catch (error) {
			console.error("Error during authentication check:", error);
			set({ isCheckingAuth: false, isAuthenticated: false });
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));