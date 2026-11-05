import { ActivityLabels } from "../../labels/activity.labels";
import { AppError } from "../../utils/AppError";
import { activitiesRepository } from "./activities.repository";

export class ActivitiesService {
  list(unreadOnly = false) {
    return activitiesRepository.list(unreadOnly);
  }

  async markRead(id: string) {
    const activity = await activitiesRepository.findById(id);
    if (!activity) {
      throw new AppError(ActivityLabels.NOT_FOUND, 404, "NOT_FOUND");
    }
    return activitiesRepository.markRead(id);
  }
}

export const activitiesService = new ActivitiesService();
