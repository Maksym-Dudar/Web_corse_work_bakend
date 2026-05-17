class DirectoryConfig {
  PUBLIC = '/public';
  USER = `${this.PUBLIC}/user`;
  AVATAR = `${this.USER}/avatar`;
  PRODUCT = `${this.PUBLIC}/product`;
}

export const DIRECTORY = new DirectoryConfig();
