import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendsData, setFriendsData] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState({});
  const [toggleSplitBill, setToggleSplitBill] = useState(false);

  function handleFriendsData(friend) {
    setFriendsData((prev) => [...prev, friend]);
  }

  function commonFunctionForSelectedFriendAndSplitBill(value, friend) {
    setSelectedFriend(friend);
    setToggleSplitBill((prev) => (value === "Close" ? false : true));
  }

  return (
    <div className="app">
      <FriendsList
        friendsData={friendsData}
        handleFriendsData={handleFriendsData}
        selectedFriend={selectedFriend}
        commonFunctionForSelectedFriendAndSplitBill={
          commonFunctionForSelectedFriendAndSplitBill
        }
        toggleSplitBill={toggleSplitBill}
      />
      {toggleSplitBill && (
        <FormSplitBill
          friend={selectedFriend}
          setToggleSplitBill={setToggleSplitBill}
          setFriendsData={setFriendsData}
        />
      )}
    </div>
  );
}

function FriendsList({
  friendsData,
  handleFriendsData,
  selectedFriend,
  commonFunctionForSelectedFriendAndSplitBill,
  toggleSplitBill,
}) {
  const [toggleAddFriendForm, setToggleAddFriendForm] = useState(false);

  function handleSetToggleAddFriendForm() {
    setToggleAddFriendForm((prev) => !prev);
  }

  return (
    <div className="sidebar">
      <ul>
        {friendsData.map((friend) => (
          <Friend
            key={friend.id}
            friend={friend}
            selectedFriend={selectedFriend}
            commonFunctionForSelectedFriendAndSplitBill={
              commonFunctionForSelectedFriendAndSplitBill
            }
            toggleSplitBill={toggleSplitBill}
          />
        ))}
      </ul>

      {toggleAddFriendForm && (
        <FormAddFriend
          friendsData={friendsData}
          handleFriendsData={handleFriendsData}
          onSetToggleAddFriendForm={handleSetToggleAddFriendForm}
        />
      )}

      <Button onClick={() => setToggleAddFriendForm((prev) => !prev)}>
        {toggleAddFriendForm ? "Close" : "Add Friend"}
      </Button>
    </div>
  );
}

function Friend({
  friend,
  selectedFriend,
  commonFunctionForSelectedFriendAndSplitBill,
  toggleSplitBill,
}) {
  function handleClick(e) {
    commonFunctionForSelectedFriendAndSplitBill(e.target.textContent, friend);
    console.log();
  }

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance > 0 ? "green" : friend.balance < 0 ? "red" : ""
        }
      >
        {friend.balance > 0
          ? `${friend.name} owes you ${Math.abs(friend.balance)}$`
          : friend.balance < 0
          ? `You owe ${friend.name} ${Math.abs(friend.balance)}$`
          : `You and ${friend.name} are equal`}{" "}
      </p>
      <Button className="button" onClick={handleClick}>
        {toggleSplitBill && selectedFriend.name === friend.name
          ? "Close"
          : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({
  friendsData,
  handleFriendsData,
  onSetToggleAddFriendForm,
}) {
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48?");
  // const [toggle, setToggle] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!friendName || !imageUrl) return;
    const newFriend = {
      id: friendsData.length + 1,
      name: friendName,
      image: imageUrl,
      balance: 0,
    };
    handleFriendsData(newFriend);
    setFriendName("");
    setImageUrl("https://i.pravatar.cc/48?");
    onSetToggleAddFriendForm();
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍🏻‍♂️Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, setToggleSplitBill, setFriendsData }) {
  const [totalBill, setTotalBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const paidByFriend = totalBill ? totalBill - yourExpense : "";
  const [whosePaying, setWhosePaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!totalBill || !yourExpense) return;
    setFriendsData((prev) =>
      prev.map((oldFriend) =>
        oldFriend === friend && whosePaying === "user"
          ? { ...friend, balance: friend.balance + paidByFriend }
          : oldFriend === friend && whosePaying === friend.name
          ? { ...friend, balance: friend.balance - yourExpense }
          : oldFriend
      )
    );
    setToggleSplitBill(false);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>💰Total Bill</label>
      <input
        type="text"
        value={totalBill}
        onChange={(e) => setTotalBill(Number(e.target.value))}
      />
      <label>🧍🏻‍♂️Your Expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) =>
          Number(e.target.value) <= totalBill &&
          setYourExpense(Number(e.target.value))
        }
      />
      <label>🧍🏻{friend.name}'s Expense</label>
      <input input="text" value={paidByFriend} disabled />
      <label>🤑Who is paying the bill</label>
      <select
        value={whosePaying}
        onChange={(e) => setWhosePaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value={friend.name}>{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
