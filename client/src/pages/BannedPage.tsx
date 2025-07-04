import React from "react";

const BannedPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 px-4 text-center">
            <h1 className="text-4xl font-bold">Access Denied</h1>
            <p className="mt-4 text-lg">
                Your account has been <strong>banned</strong>.
                <br />
                Please contact support if you believe this is a mistake.
            </p>
        </div>
    );
};

export default BannedPage;
