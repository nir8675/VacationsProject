import { dal } from "../2-utils/dal";

class LikesService {
  public async addLike(userId: number, vacationId: number): Promise<void> {
    const sql = `INSERT INTO likes (userId, vacationId) VALUES (?, ?)`;
    await dal.execute(sql, [userId, vacationId]);
  }

  public async removeLike(userId: number, vacationId: number): Promise<void> {
    const sql = `DELETE FROM likes WHERE userId = ? AND vacationId = ?`;
    await dal.execute(sql, [userId, vacationId]);
  }

  public async isLiked(userId: number, vacationId: number): Promise<boolean> {
    const sql = `SELECT * FROM likes WHERE userId = ? AND vacationId = ?`;
    const likes = await dal.execute(sql, [userId, vacationId]);
    return likes.length > 0;
  }

  public async getLikesCount(vacationId: number): Promise<number> {
    const sql = `SELECT COUNT(*) AS likesCount FROM likes WHERE vacationId = ?`;
    const result = await dal.execute(sql, [vacationId]);
    return result[0].likesCount;
  }
}

export const likesService = new LikesService();
