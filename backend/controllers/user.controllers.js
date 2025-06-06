import { User } from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Register = async (req, res) => {


  /*

 const { fullName, email, username, password } = req.body;
    
    // 2. Validate required fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }
    
    // 3. Check if user already exists (fixed syntax)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    
    if (existedUser) {
        throw new ApiError(409, "user already exists")
    }
    
    // 4. Handle file uploads
    const avatarLocalPath = req.files?.avatar[0]?.path
   // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
      coverImageLocalPath=req.files.coverImage[0].path
     }
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }
    
    // 5. Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if (!avatar) {
        throw new ApiError(400, "avatar upload failed")
    }

    // 6. Create user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    
    // 7. Get created user without sensitive data
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    // 8. Check if user creation failed (fixed logic)
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }
    
    // 9. Return success response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")

  */
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length <5) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = createToken(newUser._id);

    res.json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { Login, Register };
