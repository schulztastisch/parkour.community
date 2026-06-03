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

// Parkour City Request Handler
add_action('wp_ajax_nopriv_pkr_city_request', 'pkr_city_request_handler');
add_action('wp_ajax_pkr_city_request', 'pkr_city_request_handler');
function pkr_city_request_handler() {
    check_ajax_referer('pkr_nonce', 'nonce');
    $city = sanitize_text_field($_POST['city'] ?? '');
    $plz  = sanitize_text_field($_POST['plz']  ?? '');
    $text = sanitize_textarea_field($_POST['msg'] ?? '');
    if (empty($city) || empty($plz)) {
        wp_send_json_error('Pflichtfelder fehlen.');
    }
    $to      = 'hi@parkour.community';
    $subject = 'Neue Stadtanfrage: ' . $city . ' (' . $plz . ')';
    $body    = "Stadt: $city
PLZ: $plz
Nachricht: $text
";
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    wp_mail($to, $subject, $body, $headers);
    wp_send_json_success('Danke! Wir melden uns bald.');
}

add_action('wp_enqueue_scripts', 'pkr_localize');
function pkr_localize() {
    wp_localize_script('parkour-animation', 'pkrData', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('pkr_nonce'),
    ]);
}

// Theme-Detection inline im <head> – verhindert Light-Mode-Flackern
function pkr_darkmode_head_script() {
  echo '<script>
(function(){
  try {
    var t = localStorage.getItem("theme");
    if (!t) {
      t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch(e) {}
})();
</script>' . "
";
}
add_action('wp_head', 'pkr_darkmode_head_script', 1);

// Textarea auf Tweet-Länge begrenzen
function pkr_limit_textarea() {
  echo '<script>
document.addEventListener("DOMContentLoaded", function() {
  var ta = document.getElementById("pkr-form-msg");
  if (ta) {
    ta.setAttribute("maxlength", "280");
    ta.setAttribute("placeholder", "Optionale Nachricht (max. 280 Zeichen)...");
  }
});
</script>';
}
add_action('wp_footer', 'pkr_limit_textarea', 20);

// Automatischer Copyright-Footer mit aktuellem Jahr
function pkr_copyright_footer() {
  echo '<footer class="pkr-footer">Copyright &copy; ' . date('Y') . ' parkour.community</footer>';
}
add_action('wp_footer', 'pkr_copyright_footer', 99);
