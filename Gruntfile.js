module.exports = function(grunt) {
  grunt.initConfig({
    "install-dependencies": {
      options: {
        isDevelopment: true
      }
    },
    exec: {
      karma: 'karma start --reporters clear-screen,dots,coverage',
    }
  });

  grunt.loadNpmTasks('grunt-install-dependencies');
  grunt.loadNpmTasks('grunt-exec');
  
  grunt.registerTask('karma', 'exec:karma');
  grunt.registerTask('default', ['install-dependencies', 'karma']);
}
