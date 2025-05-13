import { User, UserFormData } from "@/types/user";
import { authApi } from "./auth";

// Admin-specific utilities for user management

/**
 * Create a new user account (admin only)
 */
export const createUser = async (userData: UserFormData): Promise<User> => {
  try {
    // In a real application, this would be an API call
    // For development, we'll mock it with localStorage

    // Create a new user object
    const newUser: User = {
      id: `u${Date.now()}`, // Generate a pseudo-unique ID
      email: userData.email,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      contactNumber: userData.contactNumber,
      isActive: userData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in localStorage (for demo purposes)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

/**
 * Update an existing user account (admin only)
 */
export const updateUser = async (
  userId: string,
  userData: UserFormData,
): Promise<User> => {
  try {
    // In a real application, this would be an API call
    // For development, we'll mock it with localStorage

    // Get existing users
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Find the user to update
    const userIndex = storedUsers.findIndex((user: User) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user data
    const updatedUser: User = {
      ...storedUsers[userIndex],
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      contactNumber: userData.contactNumber,
      isActive: userData.isActive,
      updatedAt: new Date(),
    };

    // Update storage
    storedUsers[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(storedUsers));

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

/**
 * Delete a user account (admin only)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // In a real application, this would be an API call
    // For development, we'll mock it with localStorage

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const filteredUsers = storedUsers.filter(
      (user: User) => user.id !== userId,
    );

    localStorage.setItem("users", JSON.stringify(filteredUsers));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

/**
 * Get users list (admin only)
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    // In a real application, this would be an API call
    // For development, we'll mock it with localStorage

    // Combine mock users and localStorage users
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Mock users for development
    const mockUsers = [
      {
        id: "u1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        department: "Management",
        contactNumber: "+1234567890",
        isActive: true,
        createdAt: new Date("2020-01-15"),
        updatedAt: new Date("2023-08-10"),
      },
      {
        id: "u2",
        email: "technician1@example.com",
        name: "John Technician",
        role: "technician",
        department: "Maintenance",
        contactNumber: "+1234567891",
        isActive: true,
        createdAt: new Date("2021-03-20"),
        updatedAt: new Date("2023-07-15"),
      },
      {
        id: "u3",
        email: "technician2@example.com",
        name: "Sarah Engineer",
        role: "technician",
        department: "Engineering",
        contactNumber: "+1234567892",
        isActive: true,
        createdAt: new Date("2021-05-10"),
        updatedAt: new Date("2023-09-01"),
      },
      {
        id: "u4",
        email: "user1@example.com",
        name: "Regular User",
        role: "user",
        department: "Production",
        contactNumber: "+1234567893",
        isActive: true,
        createdAt: new Date("2022-01-05"),
        updatedAt: new Date("2023-06-20"),
      },
      {
        id: "u5",
        email: "user2@example.com",
        name: "Inactive User",
        role: "user",
        department: "Quality Control",
        contactNumber: "+1234567894",
        isActive: false,
        createdAt: new Date("2022-02-15"),
        updatedAt: new Date("2023-04-10"),
      },
    ];

    // Combine mock users with localStorage users, avoiding duplicates
    const allUsers = [...mockUsers];

    storedUsers.forEach((storedUser: User) => {
      // Check if user already exists in our list
      const exists = allUsers.some((u) => u.id === storedUser.id);
      if (!exists) {
        allUsers.push(storedUser);
      }
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

/**
 * Get a single user by ID (admin only)
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    // In a real application, this would be an API call
    // For development, we'll mock it with localStorage and mockUsers

    // Get all users
    const allUsers = await getUsers();

    // Find the requested user
    const user = allUsers.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

/**
 * Create a login for an admin user (development only)
 */
export const createAdminLogin = (): void => {
  // For development purposes only
  // In a real application, admin users would be created through a secure process

  const adminUser = {
    id: "admin1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    department: "Management",
  };

  // Store in localStorage for the auth context to find
  localStorage.setItem("user", JSON.stringify(adminUser));
  localStorage.setItem("authToken", "mock-admin-token");

  console.log("Admin login created:", adminUser.email);
};
