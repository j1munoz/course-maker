const NavBar = () => {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-900 text-white text-4xl">
      <div className="flex items-start w-1/2">
        <div>Home</div>
        {/* Add more options here */}
      </div>
      <div className="flex justify-end w-1/2">
        <div>Account</div>
        {/* Add more options here */}
      </div>
    </div>
  );
};
export default NavBar;
