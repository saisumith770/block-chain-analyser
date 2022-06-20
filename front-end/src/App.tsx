import { useEffect, useState } from "react";

type transactionType = {
	from_address: string;
	to_address: string;
	block_height: number;
	block_signed_at: Date;
	fees_paid: string;
};

type transactionCollectionType = {
	credited_transactions: transactionType[];
	debited_transactions: transactionType[];
};

function App() {
	const [accounts, setAccounts] = useState<string[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
	const [transactionDetails, setTransactionDetails] = useState<transactionCollectionType | null>(null);
	useEffect(() => {
		fetch("http://localhost:5000/accounts")
			.then((data) => data.json())
			.then((json) => setAccounts(json.accounts));
	}, []);
	useEffect(() => {
		selectedAccount &&
			fetch(`http://localhost:5000/transaction-history/${selectedAccount}`)
				.then((data) => data.json())
				.then((json) => setTransactionDetails(json));
	}, [selectedAccount]);
	return (
		<div
			className="App"
			style={{
				position: "absolute",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				display: "flex",
			}}
		>
			<LeftBar accounts={accounts} setState={setSelectedAccount} />
			<MainBar transactionDetails={transactionDetails} />
		</div>
	);
}

function LeftBar(props: { accounts: string[]; setState: React.Dispatch<React.SetStateAction<string | null>> }) {
	return (
		<div
			style={{
				width: "25%",
				height: "100%",
				backgroundColor: "#353840",
			}}
		>
			<h2 style={{ fontStyle: "sans-serif", marginLeft: "30px", color: "white" }}>Accounts</h2>
			<div
				style={{
					width: "100%",
					height: "calc(100% - 72px)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					overflowY: "scroll",
				}}
			>
				{props.accounts.map((account, index) => (
					<div
						style={{
							width: "80%",
							height: "50px",
							borderRadius: "5px",
							backgroundColor: "#2F3137",
							display: "flex",
							alignItems: "center",
							margin: "5px",
							cursor: "pointer",
						}}
						onClick={() => props.setState(account)}
						key={index}
					>
						<h6 style={{ color: "whitesmoke", fontFamily: "sans-serif", margin: "10px" }}>{account}</h6>
					</div>
				))}
			</div>
		</div>
	);
}

function MainBar(props: { transactionDetails: transactionCollectionType | null }) {
	return (
		<div
			style={{
				width: "75%",
				height: "100%",
				backgroundColor: "#2F3137",
				overflowY: "scroll",
			}}
		>
			<h2 style={{ fontStyle: "sans-serif", marginLeft: "30px", color: "white" }}>CREDITED TRANSACTIONS</h2>
			{props.transactionDetails?.credited_transactions.map((transaction, index) => (
				<TransactionCard transaction={transaction} key={index} />
			))}
			<h2 style={{ fontStyle: "sans-serif", marginLeft: "30px", color: "white" }}>DEBITED TRANSACTIONS</h2>
			{props.transactionDetails?.debited_transactions.map((transaction, index) => (
				<TransactionCard transaction={transaction} key={index} />
			))}
		</div>
	);
}

function TransactionCard(props: { transaction: transactionType }) {
	return (
		<div
			style={{
				width: "90%",
				height: "100px",
				borderRadius: "5px",
				backgroundColor: "#353840",
				margin: "5px",
				display: "flex",
			}}
		>
			<div>
				<div style={{ display: "flex" }}>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						From:
					</h4>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						{props.transaction.from_address}
					</h4>
				</div>
				<div style={{ display: "flex" }}>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						To:
					</h4>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						{props.transaction.to_address}
					</h4>
				</div>
			</div>
			<div>
				<div style={{ display: "flex" }}>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						Signed At:
					</h4>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						{props.transaction.block_signed_at.toString()}
					</h4>
				</div>
				<div style={{ display: "flex" }}>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						Feed Paid:
					</h4>
					<h4
						style={{
							fontFamily: "sans-serif",
							color: "whitesmoke",
							margin: "10px",
						}}
					>
						{props.transaction.fees_paid}
					</h4>
				</div>
			</div>
		</div>
	);
}

export default App;
