import {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./App.css";
import "./css/Global.css";
import "./css/Layout.css";
import "./css/Responsive.css";

/* =========================
   AUTHENTICATION
========================= */

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* =========================
   MAIN LAYOUT
========================= */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* =========================
   PUBLIC PAGES
========================= */

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

/* =========================
   STUDENT PAGES
========================= */

import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import CourseLearning from "./pages/CourseLearning";
import Certificates from "./pages/Certificates";
import PurchaseHistory from "./pages/PurchaseHistory";

/* =========================
   SHOPPING AND PAYMENT
========================= */

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Payment from "./pages/Payment";

/* =========================
   POLICY PAGES
========================= */

import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

/* =========================
   ADMIN
========================= */

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageCourses from "./admin/ManageCourses";
import ManageCategories from "./admin/ManageCategories";
import ManageChapters from "./admin/ManageChapters";
import ManageUsers from "./admin/ManageUsers";

/* =========================
   LOCAL STORAGE HELPERS
========================= */

function readStoredArray(key) {
  try {
    const savedValue =
      localStorage.getItem(key);

    if (!savedValue) {
      return [];
    }

    const parsedValue =
      JSON.parse(savedValue);

    return Array.isArray(parsedValue)
      ? parsedValue
      : [];
  } catch (error) {
    console.error(
      `Unable to read ${key} from localStorage:`,
      error
    );

    return [];
  }
}

function readStoredNumber(key) {
  const storedValue =
    Number(localStorage.getItem(key));

  return Number.isFinite(storedValue)
    ? storedValue
    : 0;
}

/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({
  isLoggedIn,
  children,
}) {
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

/* =========================
   APP CONTENT
========================= */

function AppContent() {
  const location = useLocation();

  /* =========================
     APPLICATION STATE
  ========================= */

  const [cart, setCart] = useState(
    () => readStoredArray("cart")
  );

  const [wishlist, setWishlist] =
    useState(() =>
      readStoredArray("wishlist")
    );

  const [
    purchasedCourses,
    setPurchasedCourses,
  ] = useState(() =>
    readStoredArray(
      "purchasedCourses"
    )
  );

  const [isLoggedIn, setIsLoggedIn] =
    useState(() => {
      return (
        localStorage.getItem(
          "isLoggedIn"
        ) === "true"
      );
    });

  const [orderCount, setOrderCount] =
    useState(() =>
      readStoredNumber("orderCount")
    );

  /* =========================
     LOCAL STORAGE PERSISTENCE
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(
      "purchasedCourses",
      JSON.stringify(
        purchasedCourses
      )
    );
  }, [purchasedCourses]);

  useEffect(() => {
    localStorage.setItem(
      "isLoggedIn",
      String(isLoggedIn)
    );
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(
      "orderCount",
      String(orderCount)
    );
  }, [orderCount]);

  /* =========================
     LAYOUT VISIBILITY
  ========================= */

  const currentPath =
    location.pathname.toLowerCase();

  const isAdminPage =
    currentPath.startsWith(
      "/admin"
    );

  const isAuthPage =
    currentPath === "/login" ||
    currentPath === "/register" ||
    currentPath ===
      "/forgot-password" ||
    currentPath.startsWith(
      "/reset-password/"
    );

  const showMainLayout =
    !isAdminPage && !isAuthPage;

  /* =========================
     COURSE HELPERS
  ========================= */

  const getCourseId = (course) =>
    course?._id || course?.id;

  const toggleWishlist = (
    course
  ) => {
    const selectedCourseId =
      getCourseId(course);

    if (!selectedCourseId) {
      return;
    }

    setWishlist(
      (previousWishlist) => {
        const alreadySaved =
          previousWishlist.some(
            (savedCourse) =>
              String(
                getCourseId(
                  savedCourse
                )
              ) ===
              String(
                selectedCourseId
              )
          );

        if (alreadySaved) {
          return previousWishlist.filter(
            (savedCourse) =>
              String(
                getCourseId(
                  savedCourse
                )
              ) !==
              String(
                selectedCourseId
              )
          );
        }

        return [
          ...previousWishlist,
          {
            ...course,
            id: selectedCourseId,
            _id: selectedCourseId,
          },
        ];
      }
    );
  };

  return (
    <div className="page-container">
      {showMainLayout && (
        <Navbar
          cart={cart}
          wishlist={wishlist}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={
            setIsLoggedIn
          }
        />
      )}

      <div className="flex-grow">
        <Routes>
          {/* =========================
              ADMIN ROUTES
          ========================= */}

          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="courses"
              element={
                <ManageCourses />
              }
            />

            <Route
              path="categories"
              element={
                <ManageCategories />
              }
            />

            <Route
              path="chapters"
              element={
                <ManageChapters />
              }
            />

            <Route
              path="users"
              element={
                <ManageUsers />
              }
            />
          </Route>

          {/* =========================
              HOME
          ========================= */}

          <Route
            path="/"
            element={
              <Home
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                toggleWishlist={
                  toggleWishlist
                }
                purchasedCourses={
                  purchasedCourses
                }
                isLoggedIn={
                  isLoggedIn
                }
              />
            }
          />

          {/* =========================
              AUTHENTICATION
          ========================= */}

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              ) : (
                <Login
                  setIsLoggedIn={
                    setIsLoggedIn
                  }
                />
              )
            }
          />

          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              ) : (
                <Register
                  setIsLoggedIn={
                    setIsLoggedIn
                  }
                />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <ResetPassword />
            }
          />

          {/* =========================
              PUBLIC INFORMATION
          ========================= */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/faq"
            element={<FAQ />}
          />

          {/* =========================
              COURSE CATALOGUE
          ========================= */}

          <Route
            path="/courses"
            element={
              <Courses
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                toggleWishlist={
                  toggleWishlist
                }
                isLoggedIn={
                  isLoggedIn
                }
                purchasedCourses={
                  purchasedCourses
                }
              />
            }
          />

          <Route
            path="/courses/:id"
            element={
              <CourseDetails
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                toggleWishlist={
                  toggleWishlist
                }
                isLoggedIn={
                  isLoggedIn
                }
                purchasedCourses={
                  purchasedCourses
                }
              />
            }
          />

          {/* =========================
              OLD ROUTE REDIRECTS
          ========================= */}

          <Route
            path="/products"
            element={
              <Navigate
                to="/courses"
                replace
              />
            }
          />

          <Route
            path="/books"
            element={
              <Navigate
                to="/courses"
                replace
              />
            }
          />

          <Route
            path="/library"
            element={
              <Navigate
                to="/my-courses"
                replace
              />
            }
          />

          <Route
            path="/read/:id"
            element={
              <Navigate
                to="/courses"
                replace
              />
            }
          />

          {/* =========================
              CART
          ========================= */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <Cart
                  cart={cart}
                  setCart={setCart}
                  orderCount={
                    orderCount
                  }
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              WISHLIST
          ========================= */}

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <Wishlist
                  wishlist={wishlist}
                  toggleWishlist={
                    toggleWishlist
                  }
                  cart={cart}
                  setCart={setCart}
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PAYMENT
          ========================= */}

          <Route
            path="/payment"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <Payment
                  cart={cart}
                  setCart={setCart}
                  setPurchasedCourses={
                    setPurchasedCourses
                  }
                  setOrderCount={
                    setOrderCount
                  }
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              STUDENT DASHBOARD
          ========================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <StudentDashboard
                  purchasedCourses={
                    purchasedCourses
                  }
                  wishlist={wishlist}
                  cart={cart}
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PROFILE
          ========================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <Profile
                  isLoggedIn={
                    isLoggedIn
                  }
                  setIsLoggedIn={
                    setIsLoggedIn
                  }
                  purchasedCourses={
                    purchasedCourses
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              MY COURSES
          ========================= */}

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <MyCourses
                  purchasedCourses={
                    purchasedCourses
                  }
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              COURSE LEARNING
          ========================= */}

          <Route
            path="/learn/:id"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <CourseLearning
                  purchasedCourses={
                    purchasedCourses
                  }
                  setPurchasedCourses={
                    setPurchasedCourses
                  }
                  isLoggedIn={
                    isLoggedIn
                  }
                  cart={cart}
                  setCart={setCart}
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              CERTIFICATES
          ========================= */}

          <Route
            path="/certificates"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <Certificates
                  purchasedCourses={
                    purchasedCourses
                  }
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PURCHASE HISTORY
          ========================= */}

          <Route
            path="/purchase-history"
            element={
              <ProtectedRoute
                isLoggedIn={
                  isLoggedIn
                }
              >
                <PurchaseHistory
                  purchasedCourses={
                    purchasedCourses
                  }
                  isLoggedIn={
                    isLoggedIn
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* =========================
              POLICY PAGES
          ========================= */}

          <Route
            path="/refund-policy"
            element={
              <RefundPolicy />
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <PrivacyPolicy />
            }
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

          {/* =========================
              404 FALLBACK
          ========================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </div>

      {showMainLayout && (
        <Footer
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}

/* =========================
   MAIN APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;