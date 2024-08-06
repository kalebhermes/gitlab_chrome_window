document.addEventListener('DOMContentLoaded', function() {
    const token = 'glpat-qVYw7P_PP82M6GNsV2aB'; // Replace with your GitLab personal access token
    const apiUrl = 'https://gitlab.com/api/v4/merge_requests?state=opened&scope=all&author_username=khermes1';
    const loading = document.getElementById('loading');
    const ul = document.getElementById('merge-requests');
  
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
  
        // Fetch the pipeline status for each merge request
        fetch(`https://gitlab.com/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}`, {
          headers: {
            'Private-Token': token
          }
        })
        .then(response => response.json())
        .then(mrDetail => {
          if (mrDetail.pipeline) {
            switch (mrDetail.pipeline.status) {
              case 'running':
                pipeline.textContent = '\u23F3'; // ⏳
                pipeline.classList.add('running');
                break;
              case 'success':
                pipeline.textContent = '\u2714'; // ✔️
                pipeline.classList.add('success');
                break;
              case 'failed':
                pipeline.textContent = '\u274C'; // ❌
                pipeline.classList.add('failed');
                break;
              default:
                pipeline.textContent = '\u1F504'; // 🔄
            }
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
  