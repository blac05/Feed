import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Multi-step Registration (Email, Phone, Password)
export const register = async (req, res) => {
  try {
    const { email, phoneNumber, password, username, displayName, pageType } = req.body;

    // 1. Basic validation check
    if (!email || !phoneNumber || !password || !username || !displayName) {
      return res.status(400).json({ error: 'All registration parameters are strictly required.' });
    }

    // 2. Check if user already exists in MongoDB
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User credential conflict. Email, Phone, or Username already registered.' });
    }

    // 3. Encrypt password safely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Determine verified status (Auto-verify recognized official organizations for prototype ease)
    const approvedPageTypes = ['COMPANY', 'SPORTS_CLUB', 'GOVT', 'SPONSOR'];
    const autoVerify = approvedPageTypes.includes(pageType?.toUpperCase());

    // 5. Save to MongoDB
    const user = await prisma.user.create({
      data: {
        email,
        phoneNumber,
        password: hashedPassword,
        username: username.toLowerCase().trim(),
        displayName,
        pageType: pageType || 'USER',
        isVerified: autoVerify
      }
    });

    // 6. Sign JWT payload token
    const token = jwt.sign(
      { id: user.id, role: user.pageType },
      process.env.JWT_SECRET || 'feed_ultra_secret_2026',
      { expiresIn: '7d' }
    );

    // Exclude password from the client response profile payload
    const { password: _, ...userProfile } = user;
    res.status(201).json({ token, user: userProfile });

  } catch (error) {
    res.status(500).json({ error: `Registration Engine Fault: ${error.message}` });
  }
};

// Login Route Engine
export const login = async (req, res) => {
  try {
    const { loginCredential, password } = req.body; // Can be email or username

    if (!loginCredential || !password) {
      return res.status(400).json({ error: 'Identity credentials and matching security key required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginCredential },
          { username: loginCredential.toLowerCase().trim() }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid login metrics matching credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid security key combination matching credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.pageType },
      process.env.JWT_SECRET || 'feed_ultra_secret_2026',
      { expiresIn: '7d' }
    );

    const { password: _, ...userProfile } = user;
    res.json({ token, user: userProfile });

  } catch (error) {
    res.status(500).json({ error: `Login Authorization Pipeline Error: ${error.message}` });
  }
};

// Secure Identity Fetch Engine
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) return res.status(404).json({ error: 'User index missing inside active registry.' });

    const { password: _, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Identity verification execution dropped.' });
  }
};