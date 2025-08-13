import Match, { IMatch } from '../models/Match';
import User from '../models/User';

export class MatchService {
    constructor() { }

    /**
     * Records a completed match and updates player ELOs.
     * This is a placeholder and would need to be integrated with the game server logic.
     * @param matchData The data of the completed match.
     */
    async recordMatch(matchData: Partial<IMatch>): Promise<IMatch> {
        try {
            // In a real implementation, you would calculate ELO changes here
            // and update each player's ELO in the User model.

            // For now, just save the match data.
            const newMatch = new Match(matchData);
            await newMatch.save();

            // Placeholder for updating user ELOs
            if (matchData.eloChanges) {
                for (const eloChange of matchData.eloChanges) {
                    await User.findByIdAndUpdate(eloChange.userId, {
                        $set: { elo: eloChange.newElo },
                        $inc: { gamePlayed: 1 }
                    });
                }
            }

            return newMatch;
        } catch (error) {
            console.error("Error recording match:", error);
            throw new Error("Failed to record match.");
        }
    }
}
