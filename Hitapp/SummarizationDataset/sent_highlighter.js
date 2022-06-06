const span_hover_color = '#f5dd42';
const span_select_color = '#f5b942';

const sent_span_cls_name = 'sentchunk';

function collect_selected_sent_span_uids() {
    res = new Set()
    for (const span of document.querySelectorAll(`span.${sent_span_cls_name}[data-span-selected=true]`)) {
        res.add(span.dataset.sentUid);
    }
    return res;
}

function clear_all_highlights() {
    for (const span of document.querySelectorAll(`span.${sent_span_cls_name}[data-span-selected=true]`)) {
        delete span.dataset.spanSelected;
        span.style.backgroundColor = null;
    }
}

function setup_sent_highlighting_events() {

    const elements = document.getElementsByClassName(sent_span_cls_name);

    for (const el of elements) {

        let curr_data_sent_uid = el.dataset.sentUid;

        el.addEventListener("mouseover", function( event ) {
            for (const span of document.querySelectorAll(`span.${sent_span_cls_name}[data-sent-uid="${curr_data_sent_uid}"]`)) {
                if (!span.dataset.hasOwnProperty('spanSelected'))
                    span.style.backgroundColor = span_hover_color;
            }
        }, false);

        el.addEventListener("click", function( event ) {

            // we want to prevent any default action upon click, e.g. link navigation
            event.preventDefault();

            for (const span of document.querySelectorAll(`span.${sent_span_cls_name}[data-sent-uid="${curr_data_sent_uid}"]`)) {

                if (!span.dataset.hasOwnProperty('spanSelected')) {
                    span.dataset.spanSelected = true;
                    span.style.backgroundColor = span_select_color;
                } else {
                    delete span.dataset.spanSelected;
                    span.style.backgroundColor = null;
                }

            }

        }, false);

        el.addEventListener("mouseout", function( event ) {
            for (const span of document.querySelectorAll(`span.${sent_span_cls_name}[data-sent-uid="${curr_data_sent_uid}"]`)) {
                if (!span.dataset.hasOwnProperty('spanSelected'))
                    span.style.backgroundColor = null;
            }
        }, false);
    }

}

document.addEventListener('DOMContentLoaded', function(event) {
    setup_sent_highlighting_events();

    // These events are needed for parent <-> iframe cross-origin communication.
    window.onmessage = function(e) {
        if (e.data == 'clear_all_highlights') {
            clear_all_highlights();
        } else if (e.data == 'collect_selected_sent_span_uids') {
            res = collect_selected_sent_span_uids();
            window.parent.postMessage({
                msg: 'collect_selected_sent_span_uids', 
                data: JSON.stringify([...res])
            }, '*');
        }
    };

});
