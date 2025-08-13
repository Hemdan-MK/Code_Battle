import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMatch extends Document {
    gameMode: 'solo' | 'team3v3';
    teams: {
        players: {
            userId: Schema.Types.ObjectId;
            username: string;
        }[];
    }[];
    winner: number; // Index of the winning team in the teams array (0 or 1)
    score: string;
    eloChanges: {
        userId: Schema.Types.ObjectId;
        oldElo: number;
        newElo: number;
    }[];
    date: Date;
}

const matchSchema = new Schema<IMatch>({
    gameMode: { type: String, required: true, enum: ['solo', 'team3v3'] },
    teams: [
        {
            players: [
                {
                    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                    username: { type: String, required: true }
                }
            ]
        }
    ],
    winner: { type: Number, required: true }, // 0 or 1
    score: { type: String, required: true },
    eloChanges: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            oldElo: { type: Number, required: true },
            newElo: { type: Number, required: true }
        }
    ],
    date: { type: Date, default: Date.now }
});

const MatchModel = model<IMatch>('Match', matchSchema);

export default MatchModel;
