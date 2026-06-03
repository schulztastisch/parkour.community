<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );
         
if ( !function_exists( 'child_theme_configurator_css' ) ):
    function child_theme_configurator_css() {
        wp_enqueue_style( 'chld_thm_cfg_child', trailingslashit( get_stylesheet_directory_uri() ) . 'style.css', array( 'astra-theme-css' ) );
    }
endif;
add_action( 'wp_enqueue_scripts', 'child_theme_configurator_css', 10 );

// END ENQUEUE PARENT ACTION

// GSAP Parkour Animation
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('gsap', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', [], null, true);
    wp_enqueue_script('gsap-text', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/TextPlugin.min.js', ['gsap'], null, true);
    wp_enqueue_script('parkour-anim', get_stylesheet_directory_uri() . '/js/parkour-animation.js', ['gsap', 'gsap-text'], '1.0.0', true);
    wp_enqueue_style('parkour-anim-style', get_stylesheet_directory_uri() . '/css/parkour-animation.css', [], '1.0.0');
});
