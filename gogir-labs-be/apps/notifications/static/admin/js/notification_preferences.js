// JavaScript for notification preferences admin
(function($) {
    $(document).ready(function() {
        // Add select all/none buttons for notification types
        var $checkboxes = $('.notification-types-checkboxes');
        if ($checkboxes.length) {
            var $container = $checkboxes.closest('.form-row');
            var $buttons = $('<div class="notification-types-actions" style="margin-bottom: 10px;">' +
                '<button type="button" class="button select-all-notifications" style="margin-right: 10px;">Select All</button>' +
                '<button type="button" class="button select-none-notifications">Select None</button>' +
                '</div>');
            $container.prepend($buttons);
            
            $('.select-all-notifications').on('click', function() {
                $checkboxes.find('input[type="checkbox"]').prop('checked', true);
            });
            
            $('.select-none-notifications').on('click', function() {
                $checkboxes.find('input[type="checkbox"]').prop('checked', false);
            });
        }
    });
})(django.jQuery);

