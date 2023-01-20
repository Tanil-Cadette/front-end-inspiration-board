import "./App.css";
import { useState, useEffect } from "react";
import BoardList from "./components/BoardList.js";
import CardList from "./components/CardList.js";
import CreateBoardForm from "./components/CreateBoardForm.js";
import axios from "axios";

const api = {
  baseUrl: process.env.REACT_APP_BACKEND_URL,

  logErr: (err) => {
    console.log("Request error", err.config.url, err.config.data);
    console.log(err);
  },

  getAllBoards: () =>
    axios
      .get(`${api.baseUrl}/boards`)
      .then((response) => response.data)
      .catch(api.logErr),

  getBoard: (board_id) =>
    axios
      .get(`${api.baseUrl}/boards/${board_id}`)
      .then((response) => response.data)
      .catch(api.logErr),

  getCards: (board_id) =>
    axios
      .get(`${api.baseUrl}/boards/${board_id}/cards`)
      .then((response) => response.data)
      .catch(api.logErr),

  postBoard: (boardData) =>
    axios
      .post(`${api.baseUrl}/boards`, boardData)
      .then((response) => response.data)
      .catch(api.logErr),

  postCard: (cardData) =>
    axios
      .post(`${api.baseUrl}/cards`, cardData)
      .then((response) => response.data)
      .catch(api.logErr),

  likeCard: (cardId) =>
    axios
      .patch(`${api.baseUrl}/cards/${cardId}`)
      .then((response) => response.data)
      .catch(api.logErr),

  deleteCard: (cardId) =>
    axios
      .delete(`${api.baseUrl}/cards/${cardId}`)
      .then((response) => response.data)
      .catch(api.logErr),

  deleteBoard: (boardId) =>
    axios
      .delete(`${api.baseUrl}/boards/${boardId}`)
      .then((response) => response.data)
      .catch(api.logErr),
};

function App() {
  const [boardList, setBoardList] = useState();
  const [selectedBoard, setSelectedBoard] = useState();
  const [cardList, setCardList] = useState();

  const refreshBoardList = () => {
    api.getAllBoards().then((allBoards) => {
      setBoardList(allBoards);
    });
  };
  useEffect(refreshBoardList, []);

  const refreshCardList = () => {
    if (selectedBoard !== undefined) {
      api.getCards(selectedBoard.board_id).then((cardData) => {
        setCardList(cardData.cards);
      });
    } else {
      setCardList(undefined);
    }
  };
  useEffect(refreshCardList, [selectedBoard]);

  const selectBoard = (id) => {
    let newSelectedBoard = boardList.find((board) => id === board.board_id);
    setSelectedBoard(newSelectedBoard);
  };

  const likeCard = (id) => {
    api.likeCard(id).then((likedCard) => {
      let newCardList = [...cardList].map((card) =>
        card.card_id === likedCard.card_id ? likedCard : card
      );
      setCardList(newCardList);
    });
  };

  const deleteBoard = (id) => {
    api.deleteBoard(id).then((response) => {
      let newBoardList = [...boardList].filter(
        (board) => board.board_id !== id
      );
      setBoardList(newBoardList);
      selectBoard(undefined);
    });
  };
  const deleteCard = (id) => {
    api.deleteCard(id).then((response) => {
      let newCardList = [...cardList].filter((card) => card.card_id !== id);
      setCardList(newCardList);
    });
  };

  const createBoard = (newBoard) =>
    api.postBoard(newBoard).then((createdBoard) => {
      refreshBoardList();
      setSelectedBoard(createdBoard);
    });

  const createCard = (newCard) => {
    newCard.board_id = selectedBoard.board_id;
    api.postCard(newCard).then((createdCard) => {
      let newCardList = [...cardList, createdCard.card];
      setCardList(newCardList);
    });
  };

  return (
    <div className="App">
      <header className="inspiration_style">
        <h1 className="inspiration_background">Inspiration Board</h1>
      </header>
      <main>
        <section className="boards">
          <CreateBoardForm createBoard={createBoard}></CreateBoardForm>
          <BoardList
            boards={boardList || []}
            selectBoard={selectBoard}
            activeBoard={selectedBoard && selectedBoard.board_id}
            deleteBoard={deleteBoard}
          ></BoardList>
        </section>
        {selectedBoard !== undefined ? (
          <CardList
            title={selectedBoard.title}
            owner={selectedBoard.owner}
            cards={cardList || []}
            likeCard={likeCard}
            deleteCard={deleteCard}
            createCard={createCard}
          ></CardList>
        ) : (
          <h2>Select a board to the left</h2>
        )}
      </main>
    </div>
  );
}

export default App;
