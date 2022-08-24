package com.example.springrest.service;

import com.example.springrest.model.User;

import java.util.List;

public interface UserService {

    void addUser(User user);

    void updateUser(User user);

    void deleteUserById(Long id);

    User getUserById(Long id);

    List<User> getAllUsers();

    User getUserByEmail(String email);

    boolean existsUserById(long id);
}
