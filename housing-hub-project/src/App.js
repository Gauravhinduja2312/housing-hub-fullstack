import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Outlet } from 'react-router-dom';
import { Home, LogIn, UserPlus, Building, Menu, X, PlusCircle, House, MapPin, DollarSign, Bed, Bath, Tag, Image, Search, Filter, ArrowLeft, Edit, Trash2, MessageSquare, Send, Heart, Star, LayoutDashboard, Eye } from 'lucide-react';
import api, { WEBSOCKET_URL } from './api'; // Import the new api instance

// --- Auth Context ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
        }
    }, [currentUser]);

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// --- Navbar Component ---
const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg sticky top-0 z-50 rounded-b-xl">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                    <Building className="h-8 w-8 text-white" />
                    <span className="text-white text-3xl font-extrabold tracking-tight">Housing Hub</span>
                </Link>
                <div className="md:hidden"><button onClick={toggleMenu} className="text-white focus:outline-none">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
                <div className={`w-full md:flex md:items-center md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 items-center text-lg font-semibold">
                        <li><Link to="/" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><Home size={20} /><span>Home</span></Link></li>
                        {currentUser ? (
                            <>
                                {currentUser.userType === 'landlord' && (
                                    <>
                                        <li><Link to="/dashboard" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><LayoutDashboard size={20} /><span>Dashboard</span></Link></li>
                                        <li><Link to="/add-property" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><PlusCircle size={20} /><span>Add Property</span></Link></li>
                                    </>
                                )}
                                {currentUser.userType === 'student' && (
                                    <li><Link to="/favorites" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><Heart size={20} /><span>My Favorites</span></Link></li>
                                )}
                                <li><Link to="/properties" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><House size={20} /><span>View Properties</span></Link></li>
                                <li><Link to="/messages" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><MessageSquare size={20} /><span>Messages</span></Link></li>
                                <li><span className="text-blue-200 py-2 px-3">Hello, {currentUser.email}!</span></li>
                                <li><button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="text-white hover:text-blue-200 py-2 px-3 flex items-center space-x-2"><LogIn size={20} /><span>Login</span></Link></li>
                                <li><Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"><UserPlus className="inline-block mr-2" size={20} />Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

// --- App Layout Component ---
const AppLayout = () => {
    return (
        <div className="font-['Inter'] antialiased">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

// --- Helper Components ---
const MapView = ({ properties }) => {
    return (
        <div className="h-[400px] w-full mb-8 rounded-2xl shadow-xl border overflow-hidden flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Map functionality is currently unavailable.</p>
        </div>
    );
};
const StarRating = ({ rating, setRating, isInteractive = true }) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    onClick={() => isInteractive && setRating(star)}
                />
            ))}
        </div>
    );
};

// --- Page Components ---

const HomeView = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white p-12 rounded-2xl shadow-2xl border border-gray-200 text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
                    Welcome to <span className="text-indigo-600">Housing Hub</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Your one-step solution for finding the perfect student accommodation.
                </p>
                {currentUser ? (
                    <div>
                        <p className="text-xl text-gray-700 mb-2">You are logged in as <span className="font-bold text-indigo-700">{currentUser.email}</span>.</p>
                        <p className="text-lg text-gray-600 mb-2">User Type: <span className="font-semibold capitalize">{currentUser.userType}</span></p>
                        <p className="text-sm text-gray-500 mb-8">Your User ID: {currentUser.uid}</p>
                        {currentUser.userType === 'landlord' ? (
                            <button onClick={() => navigate('/add-property')} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105">
                                <PlusCircle className="inline-block mr-2" />Post a New Property
                            </button>
                        ) : (
                            <button onClick={() => navigate('/properties')} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105">
                                <House className="inline-block mr-2" />View Available Properties
                            </button>
                        )}
                        <div className="mt-8 p-4 bg-blue-50 rounded-xl text-blue-800 border border-blue-200">
                            <p className="font-semibold">Data Persistence Note:</p>
                            <p>Your user account is now stored in a **MongoDB database**! You'll stay logged in even if you refresh.</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-lg text-gray-600 mb-8">
                            Please <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link> or <Link to="/signup" className="text-green-600 font-semibold hover:underline">Sign Up</Link> to explore properties and manage your listings.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"><LogIn className="inline-block mr-2" />Login</button>
                            <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"><UserPlus className="inline-block mr-2" size={20} />Sign Up</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
const Login = () => {
    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const response = await api.post("/api/login", { email, password });
            const data = response.data;
            
            const userToStore = { email: data.email, uid: data.userId, userType: data.userType };
            setCurrentUser(userToStore);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Login to Housing Hub</h2>
                {error && (<div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">{error}</div>)}
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" placeholder="Enter your email" /></div>
                    <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" placeholder="Enter your password" /></div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">{loading ? "Logging in..." : "Login"}</button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">Don't have an account?{" "}<Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold">Sign Up</Link></p>
            </div>
        </div>
    );
};
const Signup = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth();
    const [signupStep, setSignupStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await api.post("/api/signup", { email, password, userType });
            setSignupStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post("/api/verify-otp", { email, otp, password, userType });
            const data = response.data;
            const userToStore = { email: data.email, uid: data.userId, userType: data.userType };
            setCurrentUser(userToStore);
            localStorage.setItem("token", data.token);
            navigate("/");

        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border">
                {signupStep === 1 ? (
                    <>
                        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Create Your Account</h2>
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}
                        <form onSubmit={handleSignupSubmit} className="space-y-6">
                            <div><label className="block text-lg font-medium mb-2">Email</label><input type="email" required className="block w-full p-3 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                            <div><label className="block text-lg font-medium mb-2">Password</label><input type="password" required className="block w-full p-3 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                            <div><label className="block text-lg font-medium mb-2">Confirm Password</label><input type="password" required className="block w-full p-3 border rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                            <div>
                                <label className="block text-lg font-medium mb-2">I am a:</label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center"><input type="radio" className="form-radio h-5 w-5 text-indigo-600" name="userType" value="student" checked={userType === 'student'} onChange={(e) => setUserType(e.target.value)} /><span className="ml-2 text-lg">Student</span></label>
                                    <label className="inline-flex items-center"><input type="radio" className="form-radio h-5 w-5 text-indigo-600" name="userType" value="landlord" checked={userType === 'landlord'} onChange={(e) => setUserType(e.target.value)} /><span className="ml-2 text-lg">Landlord</span></label>
                                </div>
                            </div>
                            <div><button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 text-lg font-semibold rounded-full text-white bg-green-600 hover:bg-green-700">{loading ? 'Sending OTP...' : 'Sign Up'}</button></div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Verify Your Email</h2>
                        <p className="text-center text-gray-600 mb-6">An OTP has been sent to {email}. Please enter it below.</p>
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div><label className="block text-lg font-medium mb-2">OTP Code</label><input type="text" required className="block w-full p-3 border rounded-lg text-center tracking-[1em]" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" /></div>
                            <div><button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700">{loading ? 'Verifying...' : 'Verify & Create Account'}</button></div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
const PropertiesView = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('price-low-to-high');
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [filterBedrooms, setFilterBedrooms] = useState('');
    const [filterBathrooms, setFilterBathrooms] = useState('');
    const [filterPropertyType, setFilterPropertyType] = useState('');

    const fetchPropertiesAndFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const propsResponse = await api.get('/api/properties');
            setProperties(propsResponse.data);

            if (currentUser && currentUser.userType === 'student') {
                const favsResponse = await api.get('/api/favorites');
                setFavorites(new Set(favsResponse.data.map(fav => fav._id)));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchPropertiesAndFavorites();
    }, [fetchPropertiesAndFavorites]);

    const handleToggleFavorite = async (propertyId) => {
        const isFavorited = favorites.has(propertyId);
        const newFavorites = new Set(favorites);

        try {
            if (isFavorited) {
                await api.delete(`/api/favorites/${propertyId}`);
                newFavorites.delete(propertyId);
            } else {
                await api.post('/api/favorites', { property_id: propertyId });
                newFavorites.add(propertyId);
            }
            setFavorites(newFavorites);
        } catch (err) {
            alert(`Error updating favorite: ${err.response?.data?.message}`);
        }
    };

    const handleDeleteProperty = async (propertyId, propertyTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${propertyTitle}"?`)) return;
        try {
            await api.delete(`/api/properties/${propertyId}`);
            alert('Property deleted successfully!');
            setProperties(prev => prev.filter(p => p._id !== propertyId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete property.');
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPrice = (!filterPriceMin || property.price >= parseInt(filterPriceMin)) && (!filterPriceMax || property.price <= parseInt(filterPriceMax));
        const matchesBedrooms = !filterBedrooms || property.bedrooms >= parseInt(filterBedrooms);
        const matchesBathrooms = !filterBathrooms || property.bathrooms >= parseInt(filterBathrooms);
        const matchesType = !filterPropertyType || property.property_type === filterPropertyType;
        return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && matchesType;
    });

    const sortedProperties = [...filteredProperties].sort((a, b) => {
        if (sortCriteria === 'price-low-to-high') return a.price - b.price;
        if (sortCriteria === 'price-high-to-low') return b.price - a.price;
        if (sortCriteria === 'date-newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortCriteria === 'date-oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
    });

    const clearFilters = () => {
        setSearchTerm(''); setFilterPriceMin(''); setFilterPriceMax('');
        setFilterBedrooms(''); setFilterBathrooms(''); setFilterPropertyType('');
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><p>Loading properties...</p></div>;
    if (error) return <div className="min-h-screen flex justify-center items-center"><p className="text-xl text-red-500">{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Available Properties</h1>
                <MapView properties={sortedProperties} />
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={20} className="text-gray-400" /></div>
                        <input type="text" placeholder="Search properties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border rounded-lg"/>
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                        <span className="text-gray-700 font-medium">Sort by:</span>
                        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="p-3 border rounded-lg">
                            <option value="price-low-to-high">Price: Low to High</option>
                            <option value="price-high-to-low">Price: High to Low</option>
                            <option value="date-newest">Date: Newest First</option>
                            <option value="date-oldest">Date: Oldest First</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center space-x-2"><Filter size={24} /><span>Advanced Filters</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div><label className="block text-sm font-medium">Min Price</label><input type="number" value={filterPriceMin} onChange={(e) => setFilterPriceMin(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium">Max Price</label><input type="number" value={filterPriceMax} onChange={(e) => setFilterPriceMax(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium">Min Bedrooms</label><input type="number" value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium">Min Bathrooms</label><input type="number" value={filterBathrooms} onChange={(e) => setFilterBathrooms(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                        <div className="md:col-span-2 lg:col-span-2"><label className="block text-sm font-medium">Property Type</label><select value={filterPropertyType} onChange={(e) => setFilterPropertyType(e.target.value)} className="w-full p-2 border rounded-lg"><option value="">All Types</option><option value="apartment">Apartment</option><option value="house">House</option><option value="room">Room</option></select></div>
                    </div>
                    <div className="mt-4"><button onClick={clearFilters} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300">Clear Filters</button></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProperties.length > 0 ? (
                        sortedProperties.map((property) => (
                            <div key={property._id} className="bg-white rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative">
                                <img src={property.image_url || `https://placehold.co/400x300/E0E0E0/333333?text=No+Image`} alt={property.title} className="w-full h-48 object-cover"/>
                                {currentUser?.userType === 'student' && (<button onClick={() => handleToggleFavorite(property._id)} className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"><Heart size={24} className={`transition-colors ${favorites.has(property._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} /></button>)}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{property.title}</h3>
                                    <p className="text-indigo-600 text-2xl font-bold mb-4">₹{property.price.toLocaleString()}</p>
                                    <div className="flex items-center text-gray-600 mb-4"><MapPin size={18} className="mr-2" /><span>{property.address}, {property.city}</span></div>
                                    <button onClick={() => navigate(`/properties/${property._id}`)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">View Details</button>
                                    {currentUser?.userType === 'landlord' && String(currentUser.uid) === String(property.landlord_id) && (
                                        <div className="flex justify-between mt-4">
                                            <Link to={`/edit-property/${property._id}`} className="text-indigo-600 hover:text-indigo-800 flex items-center"><Edit size={16} className="mr-1" /> Edit</Link>
                                            <button onClick={() => handleDeleteProperty(property._id, property.title)} className="text-red-600 hover:text-red-800 flex items-center"><Trash2 size={16} className="mr-1" /> Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (<p className="text-center text-gray-600 md:col-span-3">No properties match your filter criteria.</p>)}
                </div>
            </div>
        </div>
    );
};

const PropertyDetailsView = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const viewRecorded = useRef(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchPropertyAndReviews = useCallback(async () => {
        if (!propertyId || propertyId === 'undefined') {
            setLoading(false);
            setError("Invalid property ID.");
            return;
        }
        setLoading(true);
        try {
            const propResponse = await api.get(`/api/properties/${propertyId}`);
            setProperty(propResponse.data);
            if(propResponse.data.images?.length > 0) setSelectedImage(propResponse.data.images[0]);
            
            const revResponse = await api.get(`/api/properties/${propertyId}/reviews`);
            setReviews(revResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch details.');
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchPropertyAndReviews();
    }, [fetchPropertyAndReviews]);

    useEffect(() => {
        if (propertyId && propertyId !== 'undefined' && !viewRecorded.current) {
            api.post(`/api/properties/${propertyId}/view`).catch(err => console.error("Failed to record view:", err));
            viewRecorded.current = true;
        }
    }, [propertyId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/reviews', { property_id: propertyId, rating: newRating, comment: newReviewText });
            const revResponse = await api.get(`/api/properties/${propertyId}/reviews`);
            setReviews(revResponse.data);
            setNewReviewText("");
            setNewRating(0);
        } catch (err) { alert(`Error: ${err.response?.data?.message}`); }
    };

    const handleContact = async () => {
        try {
            const response = await api.post('/api/conversations', { property_id: property._id, landlord_id: property.landlord_id });
            navigate(`/messages/${response.data.conversationId}`);
        } catch (err) { alert(err.response?.data?.message || "Could not start conversation."); }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><p>Loading...</p></div>;
    if (error) return <div className="min-h-screen flex justify-center items-center"><p className="text-xl text-red-500">{error}</p></div>;
    if (!property) return <div className="min-h-screen flex justify-center items-center"><p>Property not found.</p></div>;

    const averageRating = reviews.length > 0 ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border">
                <button onClick={() => navigate('/properties')} className="mb-6 inline-flex items-center px-4 py-2 border rounded-full hover:bg-gray-100"><ArrowLeft size={20} className="mr-2" /> Back</button>
                {property.images?.length > 0 && (
                    <div className="mb-8">
                        <img src={selectedImage || property.images[0]} alt={property.title} className="w-full h-96 object-cover rounded-xl mb-4 shadow-md"/>
                        <div className="flex overflow-x-auto space-x-2 p-2">{property.images.map((image, index) => (<img key={index} src={image} alt={`Thumbnail ${index + 1}`} className={`w-24 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${selectedImage === image ? 'border-indigo-500' : 'border-transparent'}`} onClick={() => setSelectedImage(image)}/>))}</div>
                    </div>
                )}
                <div className="flex justify-between items-start">
                    <div><h1 className="text-5xl font-extrabold text-gray-800 mb-4">{property.title}</h1><p className="text-indigo-600 text-3xl font-bold mb-6">₹{property.price.toLocaleString()}</p></div>
                    {currentUser?.userType === 'student' && String(currentUser.uid) !== String(property.landlord_id) && (<button onClick={handleContact} className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center"><MessageSquare className="mr-2" /> Contact Landlord</button>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700 text-xl">
                    <div className="flex items-center"><MapPin className="mr-3" /><span>{property.address}, {property.city}</span></div>
                    <div className="flex items-center"><House className="mr-3" /><span>{property.property_type}</span></div>
                    {property.bedrooms && <div className="flex items-center"><Bed className="mr-3" /><span>{property.bedrooms} Bedrooms</span></div>}
                    {property.bathrooms && <div className="flex items-center"><Bath className="mr-3" /><span>{property.bathrooms} Bathrooms</span></div>}
                </div>
                {property.description && <div className="mb-8"><h3 className="text-2xl font-bold mb-3">Description</h3><p className="text-lg leading-relaxed">{property.description}</p></div>}
                {property.amenities && <div className="mb-8"><h3 className="text-2xl font-bold mb-3">Amenities</h3><div className="flex flex-wrap gap-3">{property.amenities.split(',').map((a, i) => <span key={i} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full">{a.trim()}</span>)}</div></div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {property.floor_plan_url && (<div><h3 className="text-2xl font-bold mb-3">Floor Plan</h3><img src={property.floor_plan_url} alt="Floor Plan" className="w-full rounded-xl shadow-md"/></div>)}
                    {property.virtual_tour_url && (<div><h3 className="text-2xl font-bold mb-3">Virtual Tour</h3><a href={property.virtual_tour_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border rounded-full shadow-sm text-white bg-indigo-600"><Image size={20} className="mr-2"/> Start Virtual Tour</a></div>)}
                </div>
                <div className="mt-12 pt-8 border-t">
                    <h2 className="text-3xl font-bold mb-6">Reviews</h2>
                    {reviews.length > 0 && (<div className="mb-6 flex items-center"><StarRating rating={averageRating} isInteractive={false} /><span className="ml-2 text-lg">({averageRating.toFixed(1)} out of {reviews.length} reviews)</span></div>)}
                    {currentUser?.userType === 'student' && (
                        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-xl border mb-8">
                            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                            <div className="mb-4"><label className="block font-medium mb-2">Your Rating</label><StarRating rating={newRating} setRating={setNewRating} /></div>
                            <div className="mb-4"><label className="block font-medium mb-2">Your Review</label><textarea value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} className="w-full p-2 border rounded-lg" rows="4" placeholder="Share your experience..." required></textarea></div>
                            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full">Submit Review</button>
                        </form>
                    )}
                    <div className="space-y-6">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review._id} className="border-b pb-4">
                                <div className="flex items-center mb-2"><StarRating rating={review.rating} isInteractive={false} /><p className="ml-4 font-bold">{review.student_email}</p></div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        )) : <p>No reviews yet. Be the first to leave one!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddPropertyView = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [propertyDetails, setPropertyDetails] = useState({ title: '', description: '', address: '', city: '', price: '', property_type: 'apartment', bedrooms: '', bathrooms: '', amenities: '', lat: '', lng: '' });
    const [imageFiles, setImageFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.userType !== 'landlord') navigate('/');
    }, [currentUser, navigate]);

    const handleChange = (e) => { const { name, value } = e.target; setPropertyDetails(prev => ({ ...prev, [name]: value })); };
    const handleImageChange = (e) => { setImageFiles(e.target.files); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setSubmitLoading(true);
        if (!currentUser?.uid) { setError('You must be logged in.'); setSubmitLoading(false); return; }
        const formData = new FormData();
        Object.keys(propertyDetails).forEach(key => formData.append(key, propertyDetails[key]));
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }
        try {
            await api.post('/api/properties', formData);
            setMessage('Property added successfully!');
            setPropertyDetails({ title: '', description: '', address: '', city: '', price: '', property_type: 'apartment', bedrooms: '', bathrooms: '', amenities: '', lat: '', lng: '' });
            setImageFiles([]);
            document.getElementById('image-input').value = '';
        } catch (err) { 
            setError(err.response?.data?.message || 'Failed to add property.'); 
        }
        finally { setSubmitLoading(false); }
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-2xl border">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Add New Property</h2>
                {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                        <div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="title" required value={propertyDetails.title} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <div className="relative"><House className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><select name="property_type" required value={propertyDetails.property_type} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"><option value="apartment">Apartment</option><option value="house">House</option><option value="room">Room</option></select></div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="address" required value={propertyDetails.address} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="city" required value={propertyDetails.city} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (per month)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="price" type="number" required value={propertyDetails.price} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label><div className="relative"><Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="bedrooms" type="number" value={propertyDetails.bedrooms} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label><div className="relative"><Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="bathrooms" type="number" value={propertyDetails.bathrooms} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label><input name="lat" type="number" step="any" required value={propertyDetails.lat} onChange={handleChange} className="w-full p-3 border rounded-lg"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label><input name="lng" type="number" step="any" required value={propertyDetails.lng} onChange={handleChange} className="w-full p-3 border rounded-lg"/></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label><div className="relative"><PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="amenities" value={propertyDetails.amenities} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" rows="4" value={propertyDetails.description} onChange={handleChange} className="w-full p-3 border rounded-lg"></textarea></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Images (up to 5)</label><input type="file" id="image-input" name="images" onChange={handleImageChange} className="w-full" multiple/></div>
                    <div className="md:col-span-2 mt-6"><button type="submit" disabled={submitLoading} className="w-full py-3 px-4 text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700">{submitLoading ? 'Submitting...' : 'Add Property'}</button></div>
                </form>
            </div>
        </div>
    );
};

const EditPropertyView = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!propertyId) return;
            try {
                const response = await api.get(`/api/properties/${propertyId}`);
                if (currentUser && String(response.data.landlord_id) !== String(currentUser.uid)) {
                    navigate('/');
                } else {
                    setPropertyDetails(response.data);
                }
            } catch (err) { setError(err.response?.data?.message || 'Failed to fetch property details.'); }
        };
        if (currentUser) fetchProperty();
    }, [propertyId, currentUser, navigate]);

    const handleChange = (e) => { const { name, value } = e.target; setPropertyDetails(prev => ({ ...prev, [name]: value })); };
    const handleImageChange = (e) => { setImageFiles(e.target.files); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setSubmitLoading(true);
        const formData = new FormData();
        if(propertyDetails) {
            Object.keys(propertyDetails).forEach(key => formData.append(key, propertyDetails[key]));
        }
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }
        try {
            await api.put(`/api/properties/${propertyId}`, formData);
            setMessage('Property updated successfully!');
        } catch (err) { setError(err.response?.data?.message || 'Failed to update property.'); }
        finally { setSubmitLoading(false); }
    };

    if (!propertyDetails) return <div className="min-h-screen flex items-center justify-center"><p>Loading property...</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-2xl border">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Edit Property</h2>
                {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                        <div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="title" required value={propertyDetails.title} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <div className="relative"><House className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><select name="property_type" required value={propertyDetails.property_type} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"><option value="apartment">Apartment</option><option value="house">House</option><option value="room">Room</option></select></div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="address" required value={propertyDetails.address} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="city" required value={propertyDetails.city} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (per month)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="price" type="number" required value={propertyDetails.price} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label><div className="relative"><Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="bedrooms" type="number" value={propertyDetails.bedrooms} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label><div className="relative"><Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="bathrooms" type="number" value={propertyDetails.bathrooms} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label><input name="lat" type="number" step="any" required value={propertyDetails.lat} onChange={handleChange} className="w-full p-3 border rounded-lg"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label><input name="lng" type="number" step="any" required value={propertyDetails.lng} onChange={handleChange} className="w-full p-3 border rounded-lg"/></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label><div className="relative"><PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input name="amenities" value={propertyDetails.amenities} onChange={handleChange} className="w-full p-3 pl-10 border rounded-lg"/></div></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" rows="4" value={propertyDetails.description} onChange={handleChange} className="w-full p-3 border rounded-lg"></textarea></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Update Images (replaces all existing)</label><input type="file" name="images" onChange={handleImageChange} className="w-full" multiple/></div>
                    <div className="md:col-span-2 mt-6"><button type="submit" disabled={submitLoading} className="w-full py-3 px-4 text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700">{submitLoading ? 'Updating...' : 'Update Property'}</button></div>
                </form>
            </div>
        </div>
    );
};

const MessagesView = () => {
    const { currentUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { conversationId } = useParams();
    const messagesEndRef = useRef(null);
    const ws = useRef(null);

    const fetchMessages = useCallback(async (convoId) => {
        if (!convoId) return;
        try {
            const response = await api.get(`/api/conversations/${convoId}/messages`);
            setMessages(response.data);
        } catch (err) { setError(err.response?.data?.message || 'Failed to fetch messages.'); }
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/conversations');
                setConversations(response.data);
                if (conversationId) {
                    const activeConvo = response.data.find(c => c._id === conversationId);
                    if (activeConvo) setSelectedConversation(activeConvo);
                }
            } catch (err) { setError(err.response?.data?.message || 'Failed to fetch conversations.'); }
            finally { setLoading(false); }
        };
        if(currentUser) fetchConversations();
    }, [conversationId, currentUser]);

    useEffect(() => {
        if (!selectedConversation) return;
        fetchMessages(selectedConversation._id);
        ws.current = new WebSocket(WEBSOCKET_URL);
        ws.current.onopen = () => {
            const token = localStorage.getItem("token");
            ws.current.send(JSON.stringify({ type: 'auth', token, conversationId: selectedConversation._id }));
        };
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'newMessage') {
                setMessages(prev => [...prev, message.payload]);
            }
        };
        ws.current.onclose = () => console.log('WebSocket disconnected');
        return () => { if (ws.current) ws.current.close(); };
    }, [selectedConversation, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!currentUser) return null;

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({
            type: 'message',
            payload: {
                conversation_id: selectedConversation._id,
                content: newMessage,
            }
        }));
        setMessages(prev => [...prev, { _id: Date.now(), sender_id: currentUser.uid, content: newMessage }]);
        setNewMessage("");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border h-[70vh] flex">
                <div className="w-1/3 border-r overflow-y-auto">
                    <h2 className="text-xl font-bold p-4 border-b">Conversations</h2>
                    {conversations.length > 0 ? (
                        <ul>{conversations.map(convo => (<li key={convo._id} onClick={() => setSelectedConversation(convo)} className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversation?._id === convo._id ? 'bg-indigo-100' : ''}`}><p className="font-semibold">{currentUser.userType === 'student' ? convo.landlord_id.email : convo.student_id.email}</p><p className="text-sm text-gray-600 truncate">{convo.property_id.title}</p></li>))}</ul>
                    ) : (<p className="p-4 text-gray-500">No conversations yet.</p>)}
                </div>
                <div className="w-2/3 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b">
                                <h3 className="font-bold text-lg">{currentUser.userType === 'student' ? selectedConversation.landlord_id.email : selectedConversation.student_id.email}</h3>
                                <p className="text-sm text-gray-500">{selectedConversation.property_id.title}</p>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                {messages.map(msg => {
                                    const isCurrentUser = String(msg.sender_id) === currentUser.uid;
                                    const otherUserEmail = currentUser.userType === 'student' ? selectedConversation.landlord_id.email : selectedConversation.student_id.email;
                                    return (
                                        <div key={msg._id} className={`mb-2 flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                            <p className="text-xs text-gray-500 mb-1 px-1">{isCurrentUser ? "You" : otherUserEmail}</p>
                                            <div className={`rounded-lg px-4 py-2 max-w-md ${isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.content}</div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full"/>
                                <button type="submit" className="ml-4 bg-indigo-600 text-white p-2 rounded-full"><Send size={20} /></button>
                            </form>
                        </>
                    ) : (<div className="flex-1 flex items-center justify-center"><p className="text-gray-500 text-lg">Select a conversation to start.</p></div>)}
                </div>
            </div>
        </div>
    );
};
const FavoritesView = () => {
    const { currentUser } = useAuth();
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/favorites');
                setFavoriteProperties(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch favorites.');
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchFavorites();
    }, [currentUser]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><p>Loading your favorite properties...</p></div>;
    if (error) return <div className="min-h-screen flex justify-center items-center"><p className="text-xl text-red-500">{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">My Saved Properties</h1>
                {favoriteProperties.length === 0 ? (
                    <p className="text-center text-gray-600 text-xl">You haven't saved any properties yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteProperties.map((property) => (
                            <div key={property._id} className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                                <img src={property.image_url || `https://placehold.co/400x300`} alt={property.title} className="w-full h-48 object-cover"/>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                                    <p className="text-indigo-600 text-2xl font-bold mb-4">₹{property.price.toLocaleString()}</p>
                                    <button onClick={() => navigate(`/properties/${property._id}`)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
const DashboardView = () => {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            if (!currentUser || currentUser.userType !== 'landlord') {
                navigate('/');
                return;
            }
            setLocalLoading(true);
            try {
                const response = await api.get('/api/dashboard/stats');
                setStats(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard stats.');
            } finally {
                setLocalLoading(false);
            }
        };
        if (currentUser) {
            fetchStats();
        } else if (!loading) { 
            navigate('/login');
        }
    }, [currentUser, navigate, loading]);

    if (!currentUser) return null;
    if (localLoading) return <div className="min-h-screen flex justify-center items-center"><p>Loading dashboard...</p></div>;
    if (error) return <div className="min-h-screen flex justify-center items-center"><p className="text-red-500">{error}</p></div>;
    if (!stats) return null;

    const { summary, properties } = stats;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Landlord Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center"><House size={40} className="text-blue-500 mr-4" /><div ><p className="text-3xl font-bold">{summary.totalProperties}</p><p className="text-gray-500">Total Properties</p></div></div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center"><Eye size={40} className="text-green-500 mr-4" /><div ><p className="text-3xl font-bold">{summary.totalViews}</p><p className="text-gray-500">Total Views</p></div></div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center"><Heart size={40} className="text-red-500 mr-4" /><div ><p className="text-3xl font-bold">{summary.totalFavorites}</p><p className="text-gray-500">Total Favorites</p></div></div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center"><MessageSquare size={40} className="text-purple-500 mr-4" /><div ><p className="text-3xl font-bold">{summary.totalConversations}</p><p className="text-gray-500">Total Conversations</p></div></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h2 className="text-2xl font-bold mb-4">Your Properties</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4">Property</th>
                                    <th className="p-4">Views</th>
                                    <th className="p-4">Favorites</th>
                                    <th className="p-4">Conversations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(prop => (
                                    <tr key={prop._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 flex items-center">
                                            <img src={prop.image_url || 'https://placehold.co/100x70'} alt={prop.title} className="w-24 h-16 object-cover rounded-lg mr-4" />
                                            <span className="font-semibold">{prop.title}</span>
                                        </td>
                                        <td className="p-4 text-center">{prop.view_count}</td>
                                        <td className="p-4 text-center">{prop.favorite_count}</td>
                                        <td className="p-4 text-center">{prop.conversation_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<HomeView />} />
                        <Route path="properties" element={<PropertiesView />} />
                        <Route path="properties/:propertyId" element={<PropertyDetailsView />} />
                        <Route path="add-property" element={<AddPropertyView />} />
                        <Route path="edit-property/:propertyId" element={<EditPropertyView />} />
                        <Route path="messages" element={<MessagesView />} />
                        <Route path="messages/:conversationId" element={<MessagesView />} />
                        <Route path="favorites" element={<FavoritesView />} />
                        <Route path="dashboard" element={<DashboardView />} />
                    </Route>

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

// I have renamed the main component export to avoid conflicts
// and wrapped it in the AuthProvider and BrowserRouter
// You should ensure this is the main entry point of your app.