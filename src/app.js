// ✅ Middleware first — always
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.endsWith(".vercel.app") ||
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000"
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

export default app;