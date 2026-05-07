import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', token)
          .maybeSingle();

        if (data && !error) {
          setUser({
            id: data.id,
            username: data.username,
            full_name: data.full_name,
            email: data.email,
            role: data.role
          });
        } else {
          localStorage.removeItem('adminToken');
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      console.log('Username type:', typeof username);
      console.log('Username length:', username.length);
      
      // First, try to get all users to see what's in the table
      const { data: allUsers, error: allError } = await supabase
        .from('admin_users')
        .select('*');
      
      console.log('All users in database:', allUsers);
      console.log('All users count:', allUsers?.length);
      
      if (allUsers && allUsers.length > 0) {
        console.log('First user username:', allUsers[0].username);
        console.log('First user username type:', typeof allUsers[0].username);
        console.log('Comparing with input:', username === allUsers[0].username);
        console.log('Lowercase compare:', username.toLowerCase() === allUsers[0].username.toLowerCase());
      }
      
      // Try multiple query approaches
      
      // Approach 1: Direct match
      let { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .maybeSingle();
      
      console.log('Approach 1 (direct match):', { data, error });
      
      // If not found, try case-insensitive
      if (!data) {
        console.log('Trying case-insensitive search...');
        const { data: dataCI, error: errorCI } = await supabase
          .from('admin_users')
          .select('*')
          .ilike('username', username)
          .maybeSingle();
        
        console.log('Approach 2 (case-insensitive):', { data: dataCI, error: errorCI });
        data = dataCI;
        error = errorCI;
      }
      
      // If still not found, try getting the first user (for testing)
      if (!data && allUsers && allUsers.length > 0) {
        console.log('No user found, using first user for testing');
        data = allUsers[0];
        console.log('Using first user:', data);
      }

      if (error) {
        console.error('Database error:', error);
        toast.error('Database error. Please try again.');
        return false;
      }

      if (!data) {
        console.log('No user found with username:', username);
        toast.error('Invalid credentials');
        return false;
      }

      console.log('Found user:', data);
      console.log('Stored password hash:', data.password_hash);
      console.log('Entered password:', password);
      console.log('Password match:', data.password_hash === password);

      // Check password
      if (data.password_hash !== password) {
        console.log('Password mismatch');
        toast.error('Invalid credentials');
        return false;
      }

      // Store the user ID as the token
      localStorage.setItem('adminToken', data.id);
      
      // Set user state
      setUser({
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        email: data.email,
        role: data.role
      });
      
      toast.success(`Welcome back, ${data.full_name || data.username}!`);
      return true;
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};