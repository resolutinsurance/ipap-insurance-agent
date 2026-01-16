const PaymentGuidelines = ({ network }: { network: string }) => {
  const getStepsForNetwork = (network: string) => {
    if (network === undefined) {
      return [
        "Please ensure you've sent the exact amount",
        "Keep your transaction reference handy",
        "Verification may take a few minutes",
        " Don't close this page until verified",
      ];
    }
    switch (network.toLowerCase()) {
      case "mtn":
        return [
          "Dial *170#",
          "Select option 7 for Wallet",
          "Select option 3 for My Approvals",
          "Enter your PIN to retrieve the pending approval",
          "Approve the transaction",
        ];
      case "vod":
        return [
          "Dial *111#",
          "Select option 2 for Send Money",
          "Enter the recipient’s number",
          "Enter the amount",
          "Confirm the transaction",
        ];
      case "air":
        return [
          "Dial *110#",
          "Select option 1 for Send Money",
          "Enter the recipient’s number",
          "Enter the amount",
          "Confirm the transaction",
        ];
      default:
        return [
          "Please ensure you've sent the exact amount",
          "Keep your transaction reference handy",
          "Verification may take a few minutes",
          " Don't close this page until verified",
        ];
    }
  };

  const steps = getStepsForNetwork(network);

  return (
    <div>
      <p>
        <strong>If you don’t receive the prompt, follow these steps:</strong>
      </p>
      {steps.map((step, index) => (
        <p key={index}>
          {index + 1}. {step}
        </p>
      ))}
    </div>
  );
};

export default PaymentGuidelines;
