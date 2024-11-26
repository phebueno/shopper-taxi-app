export const formatDuration = (duration: string): string => {
    const totalSeconds = parseInt(duration.replace("s", ""), 10);
    if (isNaN(totalSeconds)) {
      return "Duração inválida";
    }

    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
    } else if (totalSeconds >= 60) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`;
    } else {
      return `${totalSeconds}s`;
    }
  };