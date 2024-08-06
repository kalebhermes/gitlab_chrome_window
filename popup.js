document.addEventListener('DOMContentLoaded', function() {
  const loading = document.getElementById('loading');
  const ul = document.getElementById('merge-requests');
  const instructions = document.getElementById('instructions');
  const optionsLink = document.getElementById('options-link');

  optionsLink.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  chrome.storage.sync.get(['gitlabToken', 'queryUrl'], function(items) {
    const token = items.gitlabToken;
    const apiUrl = items.queryUrl;
    
    if (!token || !apiUrl) {
      loading.style.display = 'none';
      instructions.style.display = 'block';
      return;
    }

    fetch(apiUrl, {
      headers: {
        'Private-Token': token
      }
    })
    .then(response => response.json())
    .then(data => {
      loading.style.display = 'none';
      ul.style.display = 'block';

      data.forEach(mr => {
        const li = document.createElement('li');

        const title = document.createElement('a');
        title.href = mr.web_url;
        title.textContent = mr.title;
        title.target = '_blank';
        title.addEventListener('click', () => {
          window.close();
        });

        const pipeline = document.createElement('span');
        pipeline.classList.add('pipeline');
        
        // Show a loading spinner while fetching pipeline status
        const spinner = document.createElement('img');
        spinner.src = 'spinner.svg';
        spinner.alt = 'Loading...';
        pipeline.appendChild(spinner);

        // Fetch the pipeline status for each merge request
        fetch(`https://gitlab.com/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}`, {
          headers: {
            'Private-Token': token
          }
        })
        .then(response => response.json())
        .then(mrDetail => {
          // Remove the spinner once the status is fetched
          pipeline.removeChild(spinner);
          
          if (mrDetail.pipeline) {
            const icon = document.createElement('img');
            switch (mrDetail.pipeline.status) {
              case 'running':
                icon.src = 'running.svg';
                icon.alt = 'Running';
                pipeline.classList.add('running');
                break;
              case 'success':
                icon.src = 'success.svg';
                icon.alt = 'Success';
                pipeline.classList.add('success');
                break;
              case 'failed':
                icon.src = 'failed.svg';
                icon.alt = 'Failed';
                pipeline.classList.add('failed');
                break;
              default:
                pipeline.textContent = '🔄'; // Default case for other statuses
            }
            pipeline.appendChild(icon);
          } else {
            pipeline.style.display = 'none'; // Hide the pipeline status element if there is no pipeline
          }
        })
        .catch(error => {
          console.error('Error fetching pipeline status:', error);
          pipeline.style.display = 'none'; // Hide the pipeline status element if there's an error
        });

        li.appendChild(title);
        li.appendChild(pipeline);
        ul.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching merge requests:', error);
      loading.textContent = 'Failed to load merge requests.';
    });
  });
});
